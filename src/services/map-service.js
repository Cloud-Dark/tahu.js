// src/services/map-service.js
import axios from 'axios';
import qrcode from 'qrcode-terminal';
import chalk from 'chalk';

export class MapService {
  constructor(config) {
    this.config = config;
    this.services = {
      nominatim: 'https://nominatim.openstreetmap.org',
      overpass: 'https://overpass-api.de/api/interpreter',
      elevation: 'https://api.open-elevation.com/api/v1/lookup',
      staticMap: 'https://staticmap.openstreetmap.de/staticmap.php',
    };
  }

  async findLocation(query) {
    try {
      console.log(chalk.blue(`📍 Finding location: "${query}"`));

      // Get coordinates from Nominatim (OpenStreetMap)
      const response = await axios.get(`${this.services.nominatim}/search`, {
        params: {
          format: 'json',
          q: query,
          limit: 1,
          addressdetails: 1,
          extratags: 1,
        },
        headers: {
          'User-Agent': 'TahuJS/1.0.0 (https://github.com/Cloud-Dark/tahu.js)',
        },
        timeout: 10000,
      });

      if (response.data.length === 0) {
        return `❌ Location "${query}" not found.`;
      }

      const result = response.data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      // Get elevation data
      const elevation = await this.getElevation(lat, lng);

      // Generate all map links
      const mapLinks = this.generateLocationLinks(lat, lng);

      // Create static map URL
      const staticMapUrl = this.getStaticMapUrl(lat, lng);

      let locationInfo = `📍 Location Found: ${result.display_name}\n`;
      locationInfo += `📊 Coordinates: ${lat}, ${lng}\n`;
      if (elevation) {
        locationInfo += `⛰️  Elevation: ${elevation}m above sea level\n`;
      }
      locationInfo += `🏷️  OSM ID: ${result.osm_id}\n\n`;
      locationInfo += `🌍 Map Links:\n${mapLinks}\n\n`;
      locationInfo += `🗺️  Static Map: ${staticMapUrl}\n`;

      // Generate QR code for Google Maps link
      const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
      console.log(chalk.white('\n📱 QR Code (Google Maps):'));
      this.generateQRCode(googleMapsUrl);

      return locationInfo;
    } catch (error) {
      return `❌ Location search error: ${error.message}`;
    }
  }

  generateLocationLinks(lat, lng) {
    const links = [];

    // OpenStreetMap
    const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}&zoom=15`;
    links.push(`• OpenStreetMap: ${osmUrl}`);

    // Google Maps
    const googleUrl = `https://maps.google.com/maps?q=${lat},${lng}`;
    links.push(`• Google Maps: ${googleUrl}`);

    // Bing Maps
    const bingUrl = `https://www.bing.com/maps?cp=${lat}~${lng}&lvl=15`;
    links.push(`• Bing Maps: ${bingUrl}`);

    // WikiMapia
    const wikiMapiaUrl = `http://wikimapia.org/#lang=id&lat=${lat}&lon=${lng}&z=15`;
    links.push(`• WikiMapia: ${wikiMapiaUrl}`);

    // Apple Maps
    const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&z=15`;
    links.push(`• Apple Maps: ${appleMapsUrl}`);

    // Mapbox (if available)
    if (this.config.mapboxKey) {
      const mapboxUrl = `https://www.mapbox.com/maps/?center=${lng},${lat}&zoom=15`;
      links.push(`• Mapbox: ${mapboxUrl}`);
    }

    return links.join('\n');
  }

  generateQRCode(url) {
    qrcode.generate(url, { small: true }, (qr) => {
      console.log(qr);
    });
  }

  getStaticMapUrl(lat, lng, zoom = 15, width = 400, height = 300) {
    return `${this.services.staticMap}?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=mapnik&markers=${lat},${lng},red-pushpin`;
  }

  async getElevation(lat, lng) {
    try {
      const response = await axios.get(
        `${this.services.elevation}?locations=${lat},${lng}`,
        {
          timeout: 5000,
        }
      );
      return response.data.results[0]?.elevation || null;
    } catch (error) {
      return null;
    }
  }

  // --- LANGCHAIN FIX: Modified to accept a single string input ---
  async getDirections(input) {
    try {
      // Use a regex to robustly parse the "from ... to ..." format
      const match = String(input).match(/from (.*) to (.*)/i);
      if (!match) {
        return `❌ Invalid format for directions. Please use "from [origin] to [destination]".`;
      }

      const from = match[1].trim();
      const to = match[2].trim();

      if (!from || !to) {
        return `❌ Origin or destination is missing. Please use "from [origin] to [destination]".`;
      }

      const directionsLinks = [];
      directionsLinks.push(
        `• Google Maps: https://maps.google.com/maps/dir/${encodeURIComponent(from)}/${encodeURIComponent(to)}`
      );
      directionsLinks.push(
        `• Bing Maps: https://www.bing.com/maps/directions?rtp=adr.${encodeURIComponent(from)}~adr.${encodeURIComponent(to)}`
      );

      return `🗺️  Directions from "${from}" to "${to}":\n\n${directionsLinks.join('\n')}`;
    } catch (error) {
      return `❌ Directions error: ${error.message}`;
    }
  }
}
