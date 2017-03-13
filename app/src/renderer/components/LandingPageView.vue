<template>
  <div class="container">
    <ul class="list">
      <li class="item" v-if="emoji[name]" v-for="name in names">
        <a class="moji" :title="name" role="button" v-text="emoji[name]" @click.prevent="copy($event, name)"></a role="button">
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

        this.$electron.ipcRenderer.send('hide');
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
  display: inline-block;
  transform: scale(0.8);
  display: inline-block;
  transform-origin: left top;
  user-select: none;
  position: relative;
  transition: .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  cursor: default;
}

.moji:before {
  content: '';
  position: absolute;
  left: -.1em;
  top: 0;
  z-index: -1;
  width: 1.4em;
  height: 1.4em;
  background: transparent;
  transition: .2s cubic-bezier(0.455, 0.03, 0.515, 0.955) .1s;
}

.moji:hover:before {
  transition: .2s cubic-bezier(0.455, 0.03, 0.515, 0.955);
  background: rgba(0, 105, 217, .6);
}

.moji:active:before {
  transition: none;
  background: #0069d9;
}
</style>
