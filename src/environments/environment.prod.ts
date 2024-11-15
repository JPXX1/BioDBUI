// export const environment = {
//     production: true,
//     apiUrl: 'https://142.93.163.251/api' // Für Produktionsumgebung
   
//   };
export const environment = {
  production: true,
  apiUrl: 'https://senstadt.verwaltung-berlin.de:3000/api'  // URL der API in der Produktionsumgebung
};

  // export const environmentgeo = {
  //   production: true,
  //   geoserverUrl: 'https://142.93.163.251/geoserver'
  // };
  export const environmentgeo = {
    production: true,
    geoserverUrl: 'https://senstadt.verwaltung-berlin.de:8080/geoserver'  // Verwenden des FQDN anstelle der IP-Adresse
  };