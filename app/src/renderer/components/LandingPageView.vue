<template>
  <div class="container">
    <ul class="list">
      <li class="item" v-if="emoji[name]" v-for="name in names">
        <a class="moji" role="button" v-text="emoji[name]" @click.prevent="copy($event, name)"></a role="button">
      </li>
    </ul>
  </div>
</template>

<script>
  import Links from './LandingPageView/Links'
  import Versions from './LandingPageView/Versions'
  import emoji from 'node-emoji/lib/emoji.json';
  import emojiNames from './emoji-names';

  export default {
    components: {
      Links,
      Versions
    },
    name: 'landing-page',
    data() {
      return {
        emoji,
        names: emojiNames,
        mode: 'light',
      }
    },
    methods: {
      copy(ev, name) {
        if (ev.shiftKey) {
          this.$electron.clipboard.writeText(`:${name}:`);
          return;
        }
        this.$electron.clipboard.writeText(this.emoji[name]);
      }
    },
    mounted() {
      this.$electron.ipcRenderer.send('get-mode:req');
      this.$electron.ipcRenderer.on('get-mode:res', (ev, {darkMode}) => {
        if (darkMode) {
          this.mode = 'dark';
          document.body.style.background = '#232323';
        }
      });
    }
  }
</script>

<style scoped>

.container {
  height: 4em;
  overflow: hidden;
}

.list {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 4em;
  overflow: auto;
  padding-bottom: 20px;
}

.item {
  flex: auto;
  margin: .3em;
  height: .8em;
  line-height: 1.6;
}

.item {
  margin-bottom: -1px;
}

.moji {
  transform: scale(0.8);
  display: inline-block;
  transform-origin: left top;
}
</style>
