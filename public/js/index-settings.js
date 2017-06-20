 $('.landing').vegas({
     slides: [

         {
             src: 'images/sidebar-splash.jpg',
             video: {
                 src: [
                    'videos/splash-video.mp4'
                ],
                 loop: true,
                 mute: true
             }
        }
    ],
     overlay: 'js/vegas/overlays/02.png'
 });

 if (screen && screen.width < 480) {
     document.write('<script type="text/javascript" src="/js/nav.js"><\/script>');
 }

 (function (i, s, o, g, r, a, m) {
     i['GoogleAnalyticsObject'] = r;
     i[r] = i[r] || function () {
         (i[r].q = i[r].q || []).push(arguments)
     }, i[r].l = 1 * new Date();
     a = s.createElement(o),
         m = s.getElementsByTagName(o)[0];
     a.async = 1;
     a.src = g;
     m.parentNode.insertBefore(a, m)
 })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

 ga('create', 'UA-58235161-3', 'auto');
 ga('send', 'pageview');
