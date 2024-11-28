// export const environment = {
//     production: true,
//     apiUrl: 'https://142.93.163.251/api' // Für Produktionsumgebung
   
//   };
export const environment = {
  production: true,
     apiUrl: 'http://svw-jura.senstadt.verwalt-berlin.de:3000/api'
  //apiUrl: 'https://svw-jura.senstadt.verwalt-berlin.de:3000/api'  // URL der API in der Produktionsumgebung
};

  // export const environmentgeo = {
  //   production: true,
  //   geoserverUrl: 'https://142.93.163.251/geoserver'
  // };
  export const environmentgeo = {
    production: true,
    geoserverUrl: 'http://svw-jura.senstadt.verwalt-berlin:8080/geoserver' // Verwenden des FQDN anstelle der IP-Adresse
    //geoserverUrl: 'https://svw-jura.senstadt.verwalt-berlin.de:8080/geoserver'  // Verwenden des FQDN anstelle der IP-Adresse
  };