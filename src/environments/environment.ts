// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URL_API : 'http://localhost:83/symfony4_jwt_base/public/index.php/api',
  ROLE_SUPER_ADMIN : 'ROLE_SUPER_ADMIN',
  ROLE_USER : 'ROLE_USER',
  ROLE_VIEWER : 'ROLE_VIEWER',
  ROLE_ADMIN : 'ROLE_ADMIN',
  ATRIBUTE_MINISTERIO : 'MINISTERIO DE PRODUCCION',
  ATRIBUTE_SISTEMA : 'Base Dashboard'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
