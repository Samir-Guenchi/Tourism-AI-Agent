import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch from geoBoundaries API
    const apiResponse = await fetch('https://www.geoboundaries.org/api/current/gbOpen/DZA/ADM1/');
    const metadata = await apiResponse.json();
    
    // Get the simplified GeoJSON URL for better performance
    // geoBoundaries provides different simplification levels
    const geojsonUrl = metadata.simplifiedGeometryGeoJSON || metadata.gjDownloadURL;
    
    // Fetch the actual GeoJSON
    const response = await fetch(geojsonUrl);
    const geojson = await response.json();
    
    // Aggressive simplification: reduce coordinate precision and use Douglas-Peucker
    const simplifiedGeoJSON = {
      ...geojson,
      features: geojson.features.map((feature: any) => ({
        ...feature,
        geometry: simplifyGeometry(feature.geometry, 0.01) // Aggressive simplification
      }))
    };
    
    // Return with proper headers
    return NextResponse.json(simplifiedGeoJSON, {
      headers: {
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Error fetching Algeria boundaries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boundaries' },
      { status: 500 }
    );
  }
}

// Simplify geometry using coordinate reduction
function simplifyGeometry(geometry: any, tolerance: number): any {
  if (!geometry) return geometry;
  
  const precision = 2; // Reduce to 2 decimal places (~1km accuracy) for much better performance
  
  const simplifyCoord = (coord: number) => 
    Math.round(coord * Math.pow(10, precision)) / Math.pow(10, precision);
  
  const simplifyCoords = (coords: any): any => {
    if (typeof coords[0] === 'number') {
      return [simplifyCoord(coords[0]), simplifyCoord(coords[1])];
    }
    return coords.map(simplifyCoords);
  };
  
  // Reduce number of points using simple decimation
  const decimateCoords = (coords: any, step: number = 2): any => {
    if (typeof coords[0] === 'number') {
      return coords;
    }
    if (Array.isArray(coords[0]) && typeof coords[0][0] === 'number') {
      // This is an array of coordinates - decimate it
      return coords.filter((_: any, i: number) => i % step === 0 || i === coords.length - 1);
    }
    return coords.map((c: any) => decimateCoords(c, step));
  };
  
  let simplified = {
    ...geometry,
    coordinates: simplifyCoords(geometry.coordinates)
  };
  
  // Further reduce by decimating points (keep every 2nd point)
  simplified = {
    ...simplified,
    coordinates: decimateCoords(simplified.coordinates, 2)
  };
  
  return simplified;
}
