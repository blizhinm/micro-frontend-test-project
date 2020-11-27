<template>
  <div class="hello">
    <h1>first-app!112312312</h1>

    <!-- <iframe ref="messengerIframe" src="http://localhost:8083" frameborder="0" width="100%" height="500px"></iframe> -->

    <button @click="subscribeToPushService">Subscribe!</button>
    <br><br>
    <button @click="sendPush">Push!</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',

  data() {
    return {
      authToken: localStorage.getItem('messenger-auth-token'),

      subscriptionId: null,
    };
  },

  destroyed() {
    if (!navigator.serviceWorker) {
      return;
    }

    navigator.serviceWorker.removeEventListener('message', this.onMessage);
  },

  async mounted() {
    if (!navigator.serviceWorker) {
      console.log('navigator.serviceWorker is not present');

      return;
    }

    let swRegistration;

    try {
      swRegistration = await navigator.serviceWorker.register('sw-test.js');
    } catch (e) {
      console.log(e);

      return;
    }

    navigator.serviceWorker.addEventListener('message', this.onMessage);
  },

  methods: {
    onMessage: (event) => {
      console.log('%c%s', 'color: lime', 'FIRSTAPP got a message from SERVICE_WORKER', event);

      if (event.data.type === 'subscribe') {
        console.log(this.subscriptionId);
        this.subscriptionId = event.data.subscriptionId;
      }
    },

    async subscribeToPushService() {
      if (!navigator.serviceWorker) {
        console.log('navigator.serviceWorker is not present');

        return;
      }

      const permissionResult = await Notification.requestPermission();

      if (permissionResult !== 'granted') {
        return;
      }

      navigator.serviceWorker.controller.postMessage(JSON.stringify({
        type: 'subscribe',
        data: {
          applicationServerKey: 'BJKYHD7O2bMBO-uX8GGku3LKvV2uSN3dsvbd0sgrJ91mJcLgT-Bev8lKAMS5meqavK-RZiHulPQ1sW5lDBornWg',
        },
      }));
    },

    async sendPush() {
      if (!navigator.serviceWorker) {
        console.log('navigator.serviceWorker is not present');

        return;
      }

      const response = await fetch('http://localhost:8888/api/send-push', {
        method: 'POST',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: this.subscriptionId,
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
