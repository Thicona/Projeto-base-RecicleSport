// src/utils/leafletTemplate.ts
import { Ecoponto } from '../types/ecoponto';
import { Coordenadas } from '../services/LocationService';
import { MAP_CONFIG } from './constants';

export function gerarHtmlMapaLeaflet(
  centerLat: number,
  centerLng: number,
  userLocation: Coordenadas | null,
  pontos: Ecoponto[]
): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com" />
      <script src="https://unpkg.com"></script>
      <style>html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${centerLat}, ${centerLng}], ${MAP_CONFIG.DEFAULT_ZOOM});
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        ${
          userLocation
            ? `L.circleMarker([${userLocation.latitude}, ${userLocation.longitude}], {
                radius: 8, fillColor: "${MAP_CONFIG.USER_MARKER_COLOR}", color: "#FFFFFF", weight: 2, fillOpacity: 1
              }).addTo(map).bindPopup("Você está aqui");`
            : ''
        }
        var pontos = ${JSON.stringify(pontos)};
        pontos.forEach(function(p) {
          var iconHtml = '<div style="background-color:' + p.corPino + '; width:20px; height:20px; border-radius:50%; border:3px solid white; box-shadow:0 2px 5px rgba(0,0,0,0.4); cursor:pointer;"></div>';
          var customIcon = L.divIcon({ html: iconHtml, className: '', iconSize:[26, 26], iconAnchor: [13, 13] });
          var marker = L.marker([p.latitude, p.longitude], { icon: customIcon }).addTo(map);
          marker.on('click', function() {
            window.parent.postMessage({ type: 'SELECT_PONTO', id: p.id }, '*');
          });
        });
      </script>
    </body>
    </html>
  `;
}
