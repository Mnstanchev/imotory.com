#!/usr/bin/env node

/**
 * Coordinate Diagnostic Script
 * 
 * This script will fetch your listings and analyze their coordinates
 * to help identify any remaining mapping issues.
 */

// Load environment variables from .env.local
require('dotenv').config({ path: './.env.local' });

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api";

// Bulgaria bounds for validation
const bulgariaBounds = {
  north: 44.22,
  south: 41.22,
  east: 28.72,
  west: 22.35
};

function isValidBulgarianCoords(lng, lat) {
  return lng >= bulgariaBounds.west && lng <= bulgariaBounds.east &&
         lat >= bulgariaBounds.south && lat <= bulgariaBounds.north;
}

function getDistanceFromCenter(lng, lat) {
  // Distance from Sofia center (23.3219, 42.6977)
  const sofiaLng = 23.3219;
  const sofiaLat = 42.6977;
  
  const R = 6371; // Earth's radius in km
  const dLat = (lat - sofiaLat) * Math.PI / 180;
  const dLng = (lng - sofiaLng) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(sofiaLat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * 
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function analyzeCoordinates() {
  try {
    console.log('🔍 Fetching listings from API...');
    const response = await fetch(`${API_BASE}/listings?limit=100`);
    
    if (!response.ok) {
      throw new Error(`API responded with ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    const listings = data?.data?.listings ?? data?.listings ?? [];
    
    console.log(`📊 Found ${listings.length} listings\n`);
    
    // Analysis counters
    let hasCoordinates = 0;
    let missingCoordinates = 0;
    let invalidCoordinates = 0;
    let validCoordinates = 0;
    let suspiciousCoordinates = 0;
    
    const issues = [];
    const suspiciousListings = [];
    
    listings.forEach(listing => {
      const { id, title, latitude, longitude, location, address, slug } = listing;
      const titleText = title?.en || title?.bg || title?.ru || slug;
      const locationText = location?.name?.en || location?.name?.bg || location?.name?.ru || '';
      
      if (!latitude || !longitude) {
        missingCoordinates++;
        issues.push({
          id,
          title: titleText,
          location: locationText,
          issue: 'Missing coordinates',
          coords: null
        });
        return;
      }
      
      hasCoordinates++;
      
      if (!isValidBulgarianCoords(longitude, latitude)) {
        invalidCoordinates++;
        issues.push({
          id,
          title: titleText,
          location: locationText,
          issue: 'Outside Bulgaria bounds',
          coords: [longitude, latitude]
        });
        return;
      }
      
      validCoordinates++;
      
      // Check for suspiciously far locations (>200km from Sofia)
      const distanceFromSofia = getDistanceFromCenter(longitude, latitude);
      if (distanceFromSofia > 200) {
        suspiciousCoordinates++;
        suspiciousListings.push({
          id,
          title: titleText,
          location: locationText,
          coords: [longitude, latitude],
          distanceFromSofia: Math.round(distanceFromSofia)
        });
      }
    });
    
    // Print summary
    console.log('📈 COORDINATE ANALYSIS SUMMARY');
    console.log('================================');
    console.log(`Total listings: ${listings.length}`);
    console.log(`✅ Valid coordinates: ${validCoordinates}`);
    console.log(`❌ Missing coordinates: ${missingCoordinates}`);
    console.log(`🚫 Invalid coordinates (outside Bulgaria): ${invalidCoordinates}`);
    console.log(`⚠️  Suspicious coordinates (>200km from Sofia): ${suspiciousCoordinates}`);
    console.log('');
    
    // Print detailed issues
    if (issues.length > 0) {
      console.log('🚨 COORDINATE ISSUES FOUND:');
      console.log('============================');
      issues.forEach(issue => {
        console.log(`ID: ${issue.id}`);
        console.log(`Title: ${issue.title}`);
        console.log(`Location: ${issue.location}`);
        console.log(`Issue: ${issue.issue}`);
        if (issue.coords) {
          console.log(`Coords: [${issue.coords[0]}, ${issue.coords[1]}]`);
        }
        console.log('---');
      });
    }
    
    // Print suspicious listings
    if (suspiciousListings.length > 0) {
      console.log('\n⚠️  SUSPICIOUSLY FAR LISTINGS:');
      console.log('==============================');
      suspiciousListings.forEach(listing => {
        console.log(`ID: ${listing.id} - ${listing.title}`);
        console.log(`Location: ${listing.location}`);
        console.log(`Coords: [${listing.coords[0]}, ${listing.coords[1]}]`);
        console.log(`Distance from Sofia: ${listing.distanceFromSofia}km`);
        console.log('---');
      });
    }
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    console.log('====================');
    if (missingCoordinates > 0) {
      console.log(`• ${missingCoordinates} listings need geocoding (will be handled automatically)`);
    }
    if (invalidCoordinates > 0) {
      console.log(`• ${invalidCoordinates} listings have coordinates outside Bulgaria - these will be filtered out`);
    }
    if (suspiciousCoordinates > 0) {
      console.log(`• ${suspiciousCoordinates} listings are unusually far from Sofia - check if these are correct`);
    }
    if (validCoordinates === listings.length - missingCoordinates) {
      console.log('• ✅ All listings with coordinates appear to be valid!');
    }
    
  } catch (error) {
    console.error('❌ Error analyzing coordinates:', error.message);
    console.log('\n💡 Make sure your backend is running on http://localhost:3000');
  }
}

// Run the analysis
analyzeCoordinates();
