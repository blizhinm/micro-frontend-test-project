// import { registerApplication, start } from 'single-spa';

// registerApplication({
//   name: '@single-spa/welcome',
//   app: () =>
//     System.import(
//       'https://unpkg.com/single-spa-welcome/dist/single-spa-welcome.js'
//     ),
//   activeWhen: ['/'],
// });

// // registerApplication({
// //   name: '@localhost/navbar',
// //   app: () => System.import('@localhost/navbar'),
// //   activeWhen: ['/']
// // });

// start({
//   urlRerouteOnly: true,
// });


import { registerApplication, start } from 'single-spa';

registerApplication({
  name: 'localhost.firstapp',
  app: () =>
    System.import(
      'localhost.firstapp'
    ),
  activeWhen: ['/'],
});

registerApplication({
  name: 'localhost.secondapp',
  app: () =>
    System.import(
      'localhost.secondapp'
    ),
  activeWhen: ['#/app2'],
  customProps: { appPrefix: '#/app2' },
});

registerApplication({
  name: 'mo.messenger',
  app: () =>
    System.import(
      'mo.messenger'
    ),
  activeWhen: ['#/messenger'],
});

start();

// import { registerApplication, start } from 'single-spa';
// import {
//   constructApplications,
//   constructRoutes,
//   constructLayoutEngine,
// } from 'single-spa-layout';
// const routes = constructRoutes(document.querySelector('#single-spa-layout'));
// const applications = constructApplications({
//   routes,
//   loadApp({ name }) {
//     return System.import(name);
//   },
// });
// constructLayoutEngine({ routes, applications });
// applications.forEach(registerApplication);
// start();