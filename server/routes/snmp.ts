import express from 'express';
import { SNMPPoller, SNMPDevice, DeviceResult } from '../services/snmp-poller';
import { databaseService } from '../services/database-service';
import * as snmp from 'net-snmp';

const router = express.Router();
const snmpPoller = new SNMPPoller();

// Convert version string to SNMP version number
const getSnmpVersion = (version: string): 0 | 1 => {
  switch (version) {
    case 'v1':
      return 0; // Version1
    case 'v2c':
    default:
      return 1; // Version2c
  }
};

// Get all devices
router.get('/devices', (req, res) => {
  try {
    const devices = snmpPoller.getAllDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get devices' });
  }
});

// Get a specific device
router.get('/devices/:id', (req, res) => {
  try {
    const device = snmpPoller.getDevice(req.params.id);
    if (!device) {
      return res.status(404).json({ error: 'Device not found' });
    }
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get device' });
  }
});

// Add a new device
router.post('/devices', (req, res) => {
  try {
    const deviceData = req.body;
    const device: SNMPDevice = {
      ...deviceData,
      version: getSnmpVersion(deviceData.version),
      id: deviceData.id || Date.now().toString(),
      pollInterval: deviceData.pollInterval || 30000, // Default 30 seconds
      isActive: deviceData.isActive !== undefined ? deviceData.isActive : true
    };

    snmpPoller.addDevice(device);
    res.status(201).json(device);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add device' });
  }
});

// Update a device
router.put('/devices/:id', (req, res) => {
  try {
    const deviceData = req.body;
    const updates = {
      ...deviceData,
      version: getSnmpVersion(deviceData.version)
    };

    snmpPoller.updateDevice(req.params.id, updates);
    const updatedDevice = snmpPoller.getDevice(req.params.id);
    res.json(updatedDevice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update device' });
  }
});

// Delete a device
router.delete('/devices/:id', (req, res) => {
  try {
    snmpPoller.removeDevice(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete device' });
  }
});

// Test a device connection
router.post('/test', async (req, res) => {
  try {
    const deviceData = req.body;
    const device: SNMPDevice = {
      ...deviceData,
      version: getSnmpVersion(deviceData.version),
      id: deviceData.id || 'test-device'
    };

    const result = await snmpPoller.testDevice(device);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Test failed'
    });
  }
});

// Start the poller
router.post('/start', (req, res) => {
  try {
    snmpPoller.start();
    res.json({ message: 'SNMP poller started' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start poller' });
  }
});

// Stop the poller
router.post('/stop', (req, res) => {
  try {
    snmpPoller.stop();
    res.json({ message: 'SNMP poller stopped' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop poller' });
  }
});

// Get poller status
router.get('/status', (req, res) => {
  try {
    res.json({ 
      running: snmpPoller.isRunning(),
      devices: snmpPoller.getAllDevices().length,
      results: snmpPoller.getResults().length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get status' });
  }
});

// Get polling results
router.get('/results', (req, res) => {
  const deviceId = req.query.deviceId as string;
  const limit = parseInt(req.query.limit as string) || 100;
  const results = snmpPoller.getResults(deviceId, limit);
  res.json(results);
});

// Clear all polling results
router.delete('/results', (req, res) => {
  try {
    snmpPoller.clearResults();
    res.json({ message: 'All polling results cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear results' });
  }
});

// WebSocket-like endpoint for real-time updates (using Server-Sent Events)
router.get('/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Send initial connection event
  sendEvent('connected', { message: 'Connected to SNMP events' });

  // Listen for poller events (simplified without event emitter for now)
  const onPollComplete = (result: DeviceResult) => {
    sendEvent('pollComplete', result);
  };

  // Send periodic updates with current results and database data
  const updateInterval = setInterval(async () => {
    try {
      // Get in-memory results
      const results = snmpPoller.getResults();
      
      // Get latest metrics from database for all active transmitters
      const transmitters = await databaseService.getAllTransmitters();
      const latestMetrics = await Promise.all(
        transmitters.map(async (transmitter) => {
          try {
            const metrics = await databaseService.getLatestTransmitterMetrics(transmitter.id);
            return { transmitterId: transmitter.id, metrics };
          } catch (error) {
            console.error(`Failed to get metrics for transmitter ${transmitter.id}:`, error);
            return null;
          }
        })
      );
      
      const validMetrics = latestMetrics.filter(m => m !== null);
      
      sendEvent('update', { 
        results: results.slice(-10), // Send last 10 SNMP results
        latestMetrics: validMetrics // Send latest database metrics
      });
    } catch (error) {
      console.error('Error sending SSE update:', error);
    }
  }, 5000);

  // Clean up on client disconnect
  req.on('close', () => {
    clearInterval(updateInterval);
  });
});

// Get all latest transmitter metrics from database
router.get('/transmitters/metrics/latest', async (req, res) => {
  try {
    const transmitters = await databaseService.getAllTransmitters();
    const latestMetrics = await Promise.all(
      transmitters.map(async (transmitter) => {
        try {
          const metrics = await databaseService.getLatestMetrics(transmitter.id);
          return { transmitterId: transmitter.id, metrics };
        } catch (error) {
          console.error(`Failed to get metrics for transmitter ${transmitter.id}:`, error);
          return { transmitterId: transmitter.id, metrics: null };
        }
      })
    );
    res.json(latestMetrics.filter(item => item.metrics !== null));
  } catch (error) {
    console.error('Failed to get all latest metrics:', error);
    res.status(500).json({ error: 'Failed to get all latest metrics' });
  }
});

// Get live transmitter metrics from database
router.get('/transmitters/:id/metrics/latest', async (req, res) => {
  try {
    const transmitterId = req.params.id;
    const metrics = await databaseService.getLatestMetrics(transmitterId);
    res.json(metrics);
  } catch (error) {
    console.error('Failed to get latest metrics:', error);
    res.status(500).json({ error: 'Failed to get latest metrics' });
  }
});

// Get transmitter metrics within a time range
router.get('/transmitters/:id/metrics', async (req, res) => {
  try {
    const transmitterId = req.params.id;
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ error: 'start and end query parameters are required' });
    }
    
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }
    
    const metrics = await databaseService.getTransmitterMetricsRange(transmitterId, startDate, endDate);
    res.json(metrics);
  } catch (error) {
    console.error('Failed to get metrics range:', error);
    res.status(500).json({ error: 'Failed to get metrics range' });
  }
});

// Get all transmitters
router.get('/transmitters', async (req, res) => {
  try {
    const transmitters = await databaseService.getAllTransmitters();
    res.json(transmitters);
  } catch (error) {
    console.error('Failed to get transmitters:', error);
    res.status(500).json({ error: 'Failed to get transmitters' });
  }
});

// Get all sites
router.get('/sites', async (req, res) => {
  try {
    const sites = await databaseService.getAllSites();
    res.json(sites);
  } catch (error) {
    console.error('Failed to get sites:', error);
    res.status(500).json({ error: 'Failed to get sites' });
  }
});

export default router;