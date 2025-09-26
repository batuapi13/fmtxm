import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import StateCard from './StateCard';
import SiteCard from './SiteCard';
import MalaysiaMap from './MalaysiaMap';
import { parseCSVData } from '@/utils/csvParser';
import type { SiteData } from '@/types/dashboard';

// Load CSV data with validation to prevent HTML corruption
const loadCSVData = async (): Promise<SiteData[]> => {
  try {
    const response = await fetch('/attached_assets/malaysia_radio_frequencies_normalized_1758859695370.csv');
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const csvText = await response.text();
    
    // Validate that we received CSV content, not HTML
    const firstLine = csvText.split('\n')[0]?.trim();
    const expectedHeader = 'State,Site,Station,Frequency (MHz)';
    
    // Check for HTML indicators or wrong header
    if (csvText.includes('<!DOCTYPE html>') || 
        csvText.includes('THEME_PREVIEW_STYLE_ID') || 
        csvText.includes('HIGHLIGHT_BG:') ||
        firstLine !== expectedHeader) {
      
      console.error('CSV validation failed. Received HTML or invalid content instead of CSV.');
      console.error('First 120 characters:', csvText.substring(0, 120));
      throw new Error('Invalid CSV content - received HTML or malformed data');
    }
    
    console.log('CSV validation passed. Loading authentic Malaysian radio frequency data...');
    return parseCSVData(csvText);
    
  } catch (error) {
    console.error('Error loading CSV data:', error);
    console.log('Falling back to predefined site data to maintain functionality.');
    return fallbackSites;
  }
};

// Fallback sites data in case CSV loading fails
const fallbackSites: SiteData[] = [
  {
    id: 'site001',
    name: 'Gunung Ulu Kali',
    location: 'Genting Highlands, Selangor, Malaysia',
    coordinates: { lat: 3.4205, lng: 101.7646 },
    broadcaster: 'Multiple Commercial Broadcasters',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 4,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx001', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Eight FM', frequency: '88.1', status: 'operational' as const, transmitPower: 950, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx002', type: '2' as const, role: 'active' as const, label: '2', channelName: 'GoXuan FM', frequency: '90.5', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx003', type: '3' as const, role: 'active' as const, label: '3', channelName: 'BFM 89.9', frequency: '89.9', status: 'warning' as const, transmitPower: 880, reflectPower: 45, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx004', type: '4' as const, role: 'active' as const, label: '4', channelName: 'IKIM.fm', frequency: '91.5', status: 'operational' as const, transmitPower: 940, reflectPower: 12, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx005', type: '5' as const, role: 'active' as const, label: '5', channelName: 'THR Raaga', frequency: '92.5', status: 'operational' as const, transmitPower: 915, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx006', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Malaysia Kini', frequency: '93.3', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx007', type: '7' as const, role: 'active' as const, label: '7', channelName: 'City Plus FM', frequency: '94.5', status: 'operational' as const, transmitPower: 935, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx008', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Bernama Radio', frequency: '95.1', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx009', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'Gold FM', frequency: '96.3', status: 'operational' as const, transmitPower: 925, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx010', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Red FM', frequency: '97.7', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx011', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Suara Malaysia', frequency: '98.5', status: 'operational' as const, transmitPower: 895, reflectPower: 24, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx012', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Rhythm FM', frequency: '99.7', status: 'operational' as const, transmitPower: 940, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx013', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'Emergency Service 1', frequency: '100.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: false },
      { id: 'tx014', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Emergency Service 2', frequency: '100.5', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: false }
    ],
    alerts: 1
  },
  {
    id: 'site002',
    name: 'Gunung Jerai',
    location: 'Kedah, Malaysia',
    coordinates: { lat: 5.7919, lng: 100.4226 },
    broadcaster: 'Northern Malaysia Broadcasting Hub',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 3,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx015', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Hot FM', frequency: '97.6', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx016', type: '2' as const, role: 'active' as const, label: '2', channelName: 'Fly FM', frequency: '95.8', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx017', type: '3' as const, role: 'active' as const, label: '3', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx018', type: '4' as const, role: 'active' as const, label: '4', channelName: 'Hitz.fm', frequency: '92.9', status: 'operational' as const, transmitPower: 910, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx019', type: '5' as const, role: 'active' as const, label: '5', channelName: 'Sinar FM', frequency: '96.7', status: 'operational' as const, transmitPower: 895, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx020', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Nasional FM', frequency: '107.9', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx021', type: '7' as const, role: 'active' as const, label: '7', channelName: 'Minnal FM', frequency: '100.1', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx022', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Radio Klasik', frequency: '101.9', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx023', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'THR Gegar', frequency: '102.6', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx024', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Kedah FM', frequency: '103.5', status: 'operational' as const, transmitPower: 890, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx025', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Best FM', frequency: '104.1', status: 'error' as const, transmitPower: 0, reflectPower: 0, mainAudio: false, backupAudio: false, connectivity: false, lastSeen: '12 minutes ago', isTransmitting: false },
      { id: 'tx026', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Era FM', frequency: '105.3', status: 'warning' as const, transmitPower: 650, reflectPower: 75, mainAudio: true, backupAudio: false, connectivity: true, lastSeen: '5 seconds ago', isTransmitting: true },
      { id: 'tx027', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'Emergency Backup', frequency: '106.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: false },
      { id: 'tx028', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Standby Service', frequency: '106.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: false }
    ],
    alerts: 2
  },
  {
    id: 'site003',
    name: 'Bukit Penara',
    location: 'Penang Hill, Penang, Malaysia',
    coordinates: { lat: 5.4203, lng: 100.2708 },
    broadcaster: 'Penang Broadcasting Centre',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 4,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx029', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Red FM', frequency: '104.9', status: 'operational' as const, transmitPower: 930, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx030', type: '2' as const, role: 'active' as const, label: '2', channelName: 'My FM', frequency: '101.8', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx031', type: '3' as const, role: 'active' as const, label: '3', channelName: 'One FM', frequency: '88.1', status: 'operational' as const, transmitPower: 895, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx032', type: '4' as const, role: 'active' as const, label: '4', channelName: '988 FM', frequency: '98.8', status: 'operational' as const, transmitPower: 940, reflectPower: 14, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx033', type: '5' as const, role: 'active' as const, label: '5', channelName: 'TraXX FM', frequency: '90.7', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx034', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Light & Easy', frequency: '107.5', status: 'operational' as const, transmitPower: 920, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx035', type: '7' as const, role: 'active' as const, label: '7', channelName: 'Ai FM', frequency: '106.7', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx036', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Wai FM', frequency: '105.3', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx037', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'Era FM', frequency: '103.3', status: 'operational' as const, transmitPower: 925, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx038', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Hot FM', frequency: '99.9', status: 'operational' as const, transmitPower: 915, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx039', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Fly FM', frequency: '95.8', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx040', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 935, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx041', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'Emergency Backup', frequency: '102.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: false },
      { id: 'tx042', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Disaster Response', frequency: '102.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: false }
    ],
    alerts: 0
  },
  {
    id: 'site004',
    name: 'Gunung Korbu',
    location: 'Perak, Malaysia',
    coordinates: { lat: 4.7077, lng: 101.5068 },
    broadcaster: 'Central Malaysia Network',
    overallStatus: 'warning' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 3,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx043', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Perak FM', frequency: '106.1', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx044', type: '2' as const, role: 'active' as const, label: '2', channelName: 'THR Raaga', frequency: '99.3', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx045', type: '3' as const, role: 'active' as const, label: '3', channelName: 'Gegar FM', frequency: '102.6', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx046', type: '4' as const, role: 'active' as const, label: '4', channelName: 'Suria FM', frequency: '105.7', status: 'operational' as const, transmitPower: 910, reflectPower: 20, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx047', type: '5' as const, role: 'active' as const, label: '5', channelName: 'Era FM', frequency: '98.1', status: 'operational' as const, transmitPower: 895, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx048', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Hitz FM', frequency: '96.7', status: 'operational' as const, transmitPower: 925, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx049', type: '7' as const, role: 'active' as const, label: '7', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx050', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Fly FM', frequency: '92.9', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx051', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'Hot FM', frequency: '91.3', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx052', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Nasional FM', frequency: '107.9', status: 'operational' as const, transmitPower: 890, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx053', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Radio Klasik', frequency: '108.5', status: 'operational' as const, transmitPower: 930, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx054', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Sinar FM', frequency: '100.9', status: 'error' as const, transmitPower: 0, reflectPower: 0, mainAudio: false, backupAudio: false, connectivity: false, lastSeen: '18 minutes ago', isTransmitting: false },
      { id: 'tx055', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'Emergency TX 1', frequency: '103.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: false },
      { id: 'tx056', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Emergency TX 2', frequency: '103.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: false }
    ],
    alerts: 1
  },
  {
    id: 'site005',
    name: 'Mount Austin',
    location: 'Johor Bahru, Johor, Malaysia',
    coordinates: { lat: 1.4927, lng: 103.7414 },
    broadcaster: 'Southern Malaysia Broadcasting',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 4,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx057', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Johor FM', frequency: '101.9', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx058', type: '2' as const, role: 'active' as const, label: '2', channelName: 'Best FM', frequency: '104.1', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx059', type: '3' as const, role: 'active' as const, label: '3', channelName: 'Molek FM', frequency: '99.5', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx060', type: '4' as const, role: 'active' as const, label: '4', channelName: 'Era FM', frequency: '107.6', status: 'operational' as const, transmitPower: 895, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx061', type: '5' as const, role: 'active' as const, label: '5', channelName: 'Hot FM', frequency: '97.6', status: 'operational' as const, transmitPower: 925, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx062', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Fly FM', frequency: '95.8', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx063', type: '7' as const, role: 'active' as const, label: '7', channelName: 'Mix FM', frequency: '94.5', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx064', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Hitz FM', frequency: '92.9', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx065', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'Suria FM', frequency: '106.3', status: 'operational' as const, transmitPower: 930, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx066', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Gegar FM', frequency: '103.9', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx067', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'THR Raaga', frequency: '100.1', status: 'operational' as const, transmitPower: 915, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx068', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Minnal FM', frequency: '105.1', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx069', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'Backup Service', frequency: '102.3', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: false },
      { id: 'tx070', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Emergency TX', frequency: '102.9', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: false }
    ],
    alerts: 0
  },
  {
    id: 'site006',
    name: 'RTM Angkasapuri',
    location: 'Kuala Lumpur, Malaysia',
    coordinates: { lat: 3.1478, lng: 101.6953 },
    broadcaster: 'RTM Headquarters',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 4,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx071', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Nasional FM', frequency: '92.3', status: 'operational' as const, transmitPower: 950, reflectPower: 14, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx072', type: '2' as const, role: 'active' as const, label: '2', channelName: 'TraXX FM', frequency: '90.7', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx073', type: '3' as const, role: 'active' as const, label: '3', channelName: 'Minnal FM', frequency: '99.9', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx074', type: '4' as const, role: 'active' as const, label: '4', channelName: 'Ai FM', frequency: '96.7', status: 'operational' as const, transmitPower: 895, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx075', type: '5' as const, role: 'active' as const, label: '5', channelName: 'Wai FM', frequency: '105.3', status: 'operational' as const, transmitPower: 925, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx076', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Sinar FM', frequency: '96.7', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx077', type: '7' as const, role: 'active' as const, label: '7', channelName: 'Radio Klasik', frequency: '101.9', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx078', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Asyik FM', frequency: '107.1', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx079', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'Mutiara FM', frequency: '103.9', status: 'operational' as const, transmitPower: 930, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx080', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Sabah FM', frequency: '88.1', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx081', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Sarawak FM', frequency: '94.1', status: 'operational' as const, transmitPower: 915, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx082', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Iban Radio', frequency: '91.5', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx083', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'National Emergency', frequency: '102.3', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: false },
      { id: 'tx084', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Disaster Broadcast', frequency: '102.9', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: false }
    ],
    alerts: 0
  },
  {
    id: 'site007',
    name: 'Mount Kinabalu',
    location: 'Sabah, Malaysia',
    coordinates: { lat: 6.0647, lng: 116.5581 },
    broadcaster: 'Sabah Broadcasting Corporation',
    overallStatus: 'operational' as const,
    activeTransmitterCount: 8,
    backupTransmitterCount: 4,
    reserveTransmitterCount: 2,
    runningActiveCount: 8,
    runningBackupCount: 4,
    activeReserveCount: 0,
    transmitters: [
      { id: 'tx085', type: '1' as const, role: 'active' as const, label: '1', channelName: 'Sabah FM', frequency: '88.1', status: 'operational' as const, transmitPower: 940, reflectPower: 15, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx086', type: '2' as const, role: 'active' as const, label: '2', channelName: 'Sabah VFM', frequency: '106.1', status: 'operational' as const, transmitPower: 920, reflectPower: 18, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx087', type: '3' as const, role: 'active' as const, label: '3', channelName: 'KadazanDusun', frequency: '91.1', status: 'operational' as const, transmitPower: 910, reflectPower: 21, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx088', type: '4' as const, role: 'active' as const, label: '4', channelName: 'Murut Radio', frequency: '93.5', status: 'operational' as const, transmitPower: 895, reflectPower: 26, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx089', type: '5' as const, role: 'active' as const, label: '5', channelName: 'Bajau FM', frequency: '95.7', status: 'operational' as const, transmitPower: 925, reflectPower: 17, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx090', type: '6' as const, role: 'active' as const, label: '6', channelName: 'Era FM Sabah', frequency: '98.3', status: 'operational' as const, transmitPower: 885, reflectPower: 28, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx091', type: '7' as const, role: 'active' as const, label: '7', channelName: 'Hot FM Sabah', frequency: '100.9', status: 'operational' as const, transmitPower: 905, reflectPower: 23, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx092', type: '8' as const, role: 'active' as const, label: '8', channelName: 'Kota Kinabalu FM', frequency: '102.7', status: 'operational' as const, transmitPower: 900, reflectPower: 22, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx093', type: '9' as const, role: 'backup' as const, label: '9', channelName: 'Sandakan Radio', frequency: '104.3', status: 'operational' as const, transmitPower: 930, reflectPower: 16, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: true },
      { id: 'tx094', type: '10' as const, role: 'backup' as const, label: '10', channelName: 'Tawau FM', frequency: '107.5', status: 'operational' as const, transmitPower: 875, reflectPower: 30, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx095', type: '11' as const, role: 'backup' as const, label: '11', channelName: 'Labuan Radio', frequency: '89.3', status: 'operational' as const, transmitPower: 915, reflectPower: 19, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: true },
      { id: 'tx096', type: '12' as const, role: 'backup' as const, label: '12', channelName: 'Beaufort FM', frequency: '92.1', status: 'operational' as const, transmitPower: 890, reflectPower: 25, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '2 seconds ago', isTransmitting: true },
      { id: 'tx097', type: 'reserve1' as const, role: 'reserve' as const, label: 'Reserve 1', channelName: 'Emergency Sabah', frequency: '105.1', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '1 second ago', isTransmitting: false },
      { id: 'tx098', type: 'reserve2' as const, role: 'reserve' as const, label: 'Reserve 2', channelName: 'Disaster Relief', frequency: '105.7', status: 'operational' as const, transmitPower: 0, reflectPower: 0, mainAudio: true, backupAudio: true, connectivity: true, lastSeen: '3 seconds ago', isTransmitting: false }
    ],
    alerts: 0
  }
];

export default function Dashboard() {
  const [sites, setSites] = useState<SiteData[]>([]);
  const [filteredSites, setFilteredSites] = useState<SiteData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSiteId, setSelectedSiteId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Load CSV data on component mount
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      const csvData = await loadCSVData();
      const sitesData = csvData.length > 0 ? csvData : fallbackSites;
      setSites(sitesData);
      setFilteredSites(sitesData);
      setIsLoading(false);
    };
    
    initializeData();
  }, []);

  const onlineSites = sites.filter(site => site.overallStatus === 'operational').length;
  const totalAlerts = sites.reduce((sum, site) => sum + site.alerts, 0);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredSites(sites);
    } else {
      const filtered = sites.filter(site => 
        site.name.toLowerCase().includes(query.toLowerCase()) ||
        site.location.toLowerCase().includes(query.toLowerCase()) ||
        site.transmitters.some(tx => 
          tx.channelName.toLowerCase().includes(query.toLowerCase())
        )
      );
      setFilteredSites(filtered);
    }
  };

  const handleStatusFilter = (status: string) => {
    if (status === 'all') {
      setFilteredSites(sites);
    } else {
      const filtered = sites.filter(site => site.overallStatus === status);
      setFilteredSites(filtered);
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing all site data...');
    // todo: implement real SNMP data refresh
  };

  const handleSiteClick = (siteId: string) => {
    console.log(`Opening detailed view for site: ${siteId}`);
    setSelectedSiteId(siteId);
    // todo: implement detailed site view
  };

  const handleSettings = () => {
    console.log('Opening SNMP configuration settings...');
    // todo: implement settings panel
  };

  // Simulate real-time updates with reserve transmitter takeover logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSites(currentSites => 
        currentSites.map(site => {
          const updatedSite = { ...site };
          
          // Check for failed transmitters that reserves need to take over
          const activeTransmitters = site.transmitters.filter(tx => tx.role === 'active');
          const backupTransmitters = site.transmitters.filter(tx => tx.role === 'backup');
          const reserveTransmitters = site.transmitters.filter(tx => tx.role === 'reserve');
          
          const failedMainTransmitters = [...activeTransmitters, ...backupTransmitters].filter(tx => 
            tx.status === 'offline' || tx.status === 'error'
          );
          
          // Update all transmitters with power variations and takeover logic
          updatedSite.transmitters = site.transmitters.map((transmitter) => {
            const powerVariation = transmitter.status === 'operational' ? 
              (Math.random() - 0.5) * 10 : 0;
            
            let updatedTransmitter = { ...transmitter };
            
            // Reserve transmitter takeover logic
            if (transmitter.role === 'reserve' && failedMainTransmitters.length > 0) {
              const failedTx = failedMainTransmitters.find(tx => !reserveTransmitters.some(res => res.takenOverFrom === tx.id));
              
              if (failedTx && !transmitter.takenOverFrom) {
                // Reserve takes over failed transmitter's role
                updatedTransmitter = {
                  ...transmitter,
                  channelName: failedTx.channelName,
                  frequency: failedTx.frequency,
                  originalChannelName: transmitter.channelName,
                  originalFrequency: transmitter.frequency,
                  takenOverFrom: failedTx.id,
                  isTransmitting: transmitter.status === 'operational'
                };
              } else if (transmitter.takenOverFrom) {
                // Check if the original transmitter is back online
                const originalTx = [...activeTransmitters, ...backupTransmitters].find(tx => tx.id === transmitter.takenOverFrom);
                if (originalTx && originalTx.status === 'operational') {
                  // Restore reserve to original state
                  updatedTransmitter = {
                    ...transmitter,
                    channelName: transmitter.originalChannelName || transmitter.channelName,
                    frequency: transmitter.originalFrequency || transmitter.frequency,
                    originalChannelName: undefined,
                    originalFrequency: undefined,
                    takenOverFrom: undefined,
                    isTransmitting: false
                  };
                }
              }
            } else if (transmitter.role !== 'reserve') {
              // Update isTransmitting status for active/backup transmitters
              updatedTransmitter.isTransmitting = transmitter.status === 'operational' || transmitter.status === 'warning';
            }
            
            // Apply power variations
            const baseTransmitPower = updatedTransmitter.isTransmitting && transmitter.status === 'operational' ? 
              Math.max(0, transmitter.transmitPower + powerVariation) :
              transmitter.transmitPower;
              
            return {
              ...updatedTransmitter,
              transmitPower: updatedTransmitter.isTransmitting ? baseTransmitPower : 0,
              lastSeen: transmitter.connectivity ? 
                `${Math.floor(Math.random() * 10) + 1} seconds ago` : 
                transmitter.lastSeen
            };
          });
          
          return updatedSite;
        })
      );
    }, 50); // Sub-100ms polling for real-time updates

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [sites, searchQuery]);

  // Group filtered sites by state
  const groupedByState = filteredSites.reduce((groups, site) => {
    // Extract state from location (e.g., "JOHOR, Malaysia" -> "JOHOR")
    const state = site.location.split(',')[0].trim();
    if (!groups[state]) {
      groups[state] = [];
    }
    groups[state].push(site);
    return groups;
  }, {} as Record<string, SiteData[]>);

  // Sort states alphabetically
  const sortedStates = Object.keys(groupedByState).sort();

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        totalSites={sites.length}
        onlineSites={onlineSites}
        totalAlerts={totalAlerts}
        onSearch={handleSearch}
        onRefresh={handleRefresh}
        onSettingsClick={handleSettings}
      />
      
      <div className="p-6 space-y-6">
        {/* Malaysia Map Section */}
        <div className="w-full">
          <MalaysiaMap 
            sites={filteredSites}
            onSiteSelect={handleSiteClick}
            onStatusFilter={handleStatusFilter}
            selectedSiteId={selectedSiteId}
          />
        </div>
        
        {/* State Cards Grid */}
        <div>
          <h2 className="text-xl font-semibold mb-4" data-testid="sites-section-title">
            Transmission Sites by State
          </h2>
          <div className="space-y-6">
            {sortedStates.map(state => (
              <StateCard
                key={state}
                state={state}
                sites={groupedByState[state]}
                onSiteClick={handleSiteClick}
              />
            ))}
          </div>
        
        {filteredSites.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sites found matching "{searchQuery}"</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}