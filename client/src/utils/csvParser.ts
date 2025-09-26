import type { SiteData, TransmitterData } from '@/types/dashboard';

// Site coordinates mapping for major Malaysian transmission sites
const siteCoordinates: Record<string, { lat: number; lng: number; state: string }> = {
  'Johor Bahru & Singapura | Gunung Pulai': { lat: 1.6298, lng: 103.6407, state: 'JOHOR' },
  'Johor Bahru Metropolis Tower': { lat: 1.4927, lng: 103.7414, state: 'JOHOR' },
  'Mersing, Kuala Rompin, Pekan | Bukit Tinggi': { lat: 2.4312, lng: 103.8435, state: 'JOHOR' },
  'Taman Sentosa': { lat: 1.4701, lng: 103.8198, state: 'JOHOR' },
  'Gunung Jerai': { lat: 5.7919, lng: 100.4226, state: 'KEDAH' },
  'Gunung Raya': { lat: 6.3925, lng: 99.7068, state: 'KEDAH' },
  'Menara Alor Setar': { lat: 6.1239, lng: 100.3651, state: 'KEDAH' },
  'Gua Musang | Bukit Chupak': { lat: 4.8831, lng: 101.9687, state: 'KELANTAN' },
  'Kota Bharu | Tunjong': { lat: 6.1664, lng: 102.2857, state: 'KELANTAN' },
  'Machang | Bukit Bakar': { lat: 5.7694, lng: 102.2233, state: 'KELANTAN' },
  'Pasir Puteh | Jajahan Pasir Puteh': { lat: 5.8301, lng: 102.4065, state: 'KELANTAN' },
  'Bukit Sungai Besi': { lat: 3.0503, lng: 101.7075, state: 'KUALA LUMPUR' },
  'Menara Kuala Lumpur': { lat: 3.1478, lng: 101.6953, state: 'KUALA LUMPUR' },
  'Gunung Ledang': { lat: 2.3781, lng: 102.6089, state: 'MELAKA' },
  'Bukit Gun': { lat: 2.7297, lng: 101.9381, state: 'N.SEMBILAN' },
  'Seremban | Gunung Telapak Buruk': { lat: 2.8073, lng: 101.9659, state: 'N.SEMBILAN' },
  'Bukit Istana': { lat: 3.8126, lng: 103.3256, state: 'PAHANG' },
  'Gunung Brinchang': { lat: 4.5123, lng: 101.3778, state: 'PAHANG' },
  'Gunung Tahan': { lat: 4.6378, lng: 102.2530, state: 'PAHANG' },
  'Jerantut | Bukit Botak': { lat: 3.9478, lng: 102.3634, state: 'PAHANG' },
  'Kuantan | Bukit Pelindung': { lat: 3.8077, lng: 103.3260, state: 'PAHANG' },
  'Maran | Bukit Makro': { lat: 3.5659, lng: 102.7077, state: 'PAHANG' },
  'Ipoh | Gunung Kledang': { lat: 4.6126, lng: 101.0901, state: 'PERAK' },
  'RTM Gerik': { lat: 5.4233, lng: 101.1233, state: 'PERAK' },
  'Taiping | Bukit Larut': { lat: 4.8388, lng: 100.7897, state: 'PERAK' },
  'Tapah | Changkat Rembian': { lat: 4.1967, lng: 101.2583, state: 'PERAK' },
  'Bukit Penara': { lat: 5.4203, lng: 100.2708, state: 'PULAU PINANG' },
  'Beaufort | Bukit Gadong': { lat: 5.3475, lng: 115.7461, state: 'SABAH' },
  'Bukit Timbalai': { lat: 6.0833, lng: 116.1167, state: 'SABAH' },
  'Gunung Kinabalu': { lat: 6.0647, lng: 116.5581, state: 'SABAH' },
  'Kota Kinabalu | Bukit Karatong': { lat: 5.9804, lng: 116.0735, state: 'SABAH' },
  'Kota Kinabalu | Bukit Lawa Mandau': { lat: 5.9749, lng: 116.0724, state: 'SABAH' },
  'Sandakan | Bukit Trig': { lat: 5.8402, lng: 118.1180, state: 'SABAH' },
  'Tawau | Gunung Andrassy': { lat: 4.2481, lng: 117.8831, state: 'SABAH' },
  'Universiti Malaysia Sabah': { lat: 6.0344, lng: 116.1107, state: 'SABAH' },
  'Bintulu | Bukit Setiam': { lat: 3.1665, lng: 113.0378, state: 'SARAWAK' },
  'Kuching | Bukit Antu': { lat: 1.4297, lng: 111.1433, state: 'SARAWAK' },
  'Kuching | Bukit Djin': { lat: 1.4648, lng: 110.4178, state: 'SARAWAK' },
  'Kuching | Gunung Serapi': { lat: 1.4297, lng: 110.3297, state: 'SARAWAK' },
  'Miri | Bukit Lambir': { lat: 4.3871, lng: 113.9870, state: 'SARAWAK' },
  'Miri | Tanjong Lobang': { lat: 4.4086, lng: 114.0071, state: 'SARAWAK' },
  'Sarikei | Bukit Kayu Malam': { lat: 2.1203, lng: 111.5167, state: 'SARAWAK' },
  'Serian | Gunung Ampungan': { lat: 1.2047, lng: 110.5139, state: 'SARAWAK' },
  'Sibu | Bukit Lima': { lat: 2.3125, lng: 111.8269, state: 'SARAWAK' },
  'Sri Aman | Bukit Temudok': { lat: 1.2325, lng: 111.4603, state: 'SARAWAK' },
  'Lembah Klang | Gunung Ulu Kali': { lat: 3.4205, lng: 101.7646, state: 'SELANGOR' },
  'Bukit Bauk': { lat: 4.8411, lng: 102.9734, state: 'TERENGGANU' },
  'Bukit Bintang': { lat: 4.6667, lng: 103.2333, state: 'TERENGGANU' },
  'Kemaman | Bukit Kemuning': { lat: 4.2361, lng: 103.4267, state: 'TERENGGANU' },
  'Kuala Terengganu (Bukit Besar)': { lat: 5.3117, lng: 103.1324, state: 'TERENGGANU' },
  'Kuala Terengganu (Bukit Jerung)': { lat: 5.3302, lng: 103.1408, state: 'TERENGGANU' }
};

export interface CSVRow {
  State: string;
  Site: string;
  Station: string;
  'Frequency (MHz)': string;
}

// Simple RFC 4180 compliant CSV parser that handles quoted fields
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      // Handle escaped quotes ("")
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // Skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function parseCSVData(csvContent: string): SiteData[] {
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  
  const csvData: CSVRow[] = [];
  
  // Parse CSV rows using proper CSV parsing
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const values = parseCSVLine(line);
    if (values.length >= 4) {
      csvData.push({
        State: values[0],
        Site: values[1],
        Station: values[2],
        'Frequency (MHz)': values[3]
      });
    }
  }
  
  // Group by site
  const siteGroups = new Map<string, CSVRow[]>();
  
  csvData.forEach(row => {
    if (!siteGroups.has(row.Site)) {
      siteGroups.set(row.Site, []);
    }
    siteGroups.get(row.Site)!.push(row);
  });
  
  // Convert to SiteData format
  const sites: SiteData[] = [];
  let siteIndex = 1;
  
  siteGroups.forEach((stations, siteName) => {
    const coordinates = siteCoordinates[siteName] || { lat: 3.1390, lng: 101.6869, state: 'UNKNOWN' };
    const state = stations[0]?.State || 'UNKNOWN';
    
    // Create transmitters from stations (limit to first 12 for main transmitters + 2 reserves)
    const transmitters: TransmitterData[] = [];
    const maxTransmitters = Math.min(stations.length, 12);
    
    // Add main transmitters (active: 1-8, backup: 9-12)
    for (let i = 0; i < maxTransmitters; i++) {
      const station = stations[i];
      const txIndex = i + 1;
      const role = txIndex <= 8 ? 'active' : 'backup';
      
      // Simulate some transmitters being down for testing
      let status: 'operational' | 'warning' | 'error' | 'offline' = 'operational';
      let isTransmitting = true;
      
      // Create scenarios with some downed transmitters
      if (siteName.includes('Kota Bharu') && (txIndex === 3 || txIndex === 7)) {
        status = 'offline';
        isTransmitting = false;
      } else if (siteName.includes('Kuantan') && txIndex === 5) {
        status = 'error';
        isTransmitting = false;
      } else if (siteName.includes('Jerai') && txIndex === 11) {
        status = 'offline';
        isTransmitting = false;
      }
      
      transmitters.push({
        id: `tx${siteIndex.toString().padStart(3, '0')}_${txIndex}`,
        type: txIndex.toString() as `${number}`,
        role: role,
        label: txIndex.toString(),
        channelName: station.Station,
        frequency: station['Frequency (MHz)'],
        status,
        transmitPower: isTransmitting ? Math.floor(Math.random() * 200) + 800 : 0,
        reflectPower: isTransmitting ? Math.floor(Math.random() * 40) + 10 : 0,
        mainAudio: status !== 'offline',
        backupAudio: status === 'operational',
        connectivity: status !== 'offline',
        lastSeen: status === 'offline' ? '15 minutes ago' : `${Math.floor(Math.random() * 10) + 1} seconds ago`,
        isTransmitting
      });
    }
    
    // Add 2 reserve transmitters
    for (let i = 0; i < 2; i++) {
      const reserveId = i + 1;
      
      // Check if any main transmitters are down to simulate takeover
      const downedTransmitters = transmitters.filter(tx => !tx.isTransmitting);
      const shouldTakeOver = downedTransmitters.length > i;
      const takenOverTx = shouldTakeOver ? downedTransmitters[i] : null;
      
      transmitters.push({
        id: `tx${siteIndex.toString().padStart(3, '0')}_reserve${reserveId}`,
        type: `reserve${reserveId}` as `reserve${number}`,
        role: 'reserve',
        label: `Reserve ${reserveId}`,
        channelName: takenOverTx ? takenOverTx.channelName : `Emergency Service ${reserveId}`,
        frequency: takenOverTx ? takenOverTx.frequency : `${100 + reserveId}.${Math.floor(Math.random() * 9)}`,
        originalChannelName: takenOverTx ? `Emergency Service ${reserveId}` : undefined,
        originalFrequency: takenOverTx ? `${100 + reserveId}.${Math.floor(Math.random() * 9)}` : undefined,
        status: 'operational',
        transmitPower: shouldTakeOver ? Math.floor(Math.random() * 200) + 800 : 0,
        reflectPower: shouldTakeOver ? Math.floor(Math.random() * 40) + 10 : 0,
        mainAudio: true,
        backupAudio: true,
        connectivity: true,
        lastSeen: `${Math.floor(Math.random() * 10) + 1} seconds ago`,
        isTransmitting: shouldTakeOver,
        takenOverFrom: takenOverTx?.id
      });
    }
    
    // Calculate counts
    const activeCount = transmitters.filter(tx => tx.role === 'active').length;
    const backupCount = transmitters.filter(tx => tx.role === 'backup').length;
    const reserveCount = transmitters.filter(tx => tx.role === 'reserve').length;
    
    const runningActiveCount = transmitters.filter(tx => tx.role === 'active' && tx.isTransmitting).length;
    const runningBackupCount = transmitters.filter(tx => tx.role === 'backup' && tx.isTransmitting).length;
    const activeReserveCount = transmitters.filter(tx => tx.role === 'reserve' && tx.isTransmitting).length;
    
    sites.push({
      id: `site${siteIndex.toString().padStart(3, '0')}`,
      name: siteName,
      location: `${state}, Malaysia`,
      coordinates,
      broadcaster: `${state} Broadcasting Network`,
      overallStatus: transmitters.some(tx => tx.status === 'offline') ? 'error' : 
                   transmitters.some(tx => tx.status === 'warning') ? 'warning' : 'operational',
      transmitters,
      activeTransmitterCount: activeCount,
      backupTransmitterCount: backupCount, 
      reserveTransmitterCount: reserveCount,
      runningActiveCount,
      runningBackupCount,
      activeReserveCount,
      alerts: transmitters.filter(tx => tx.status === 'offline' || tx.status === 'error').length
    });
    
    siteIndex++;
  });
  
  return sites;
}