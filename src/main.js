import { createApp } from 'vue';
import App from './App.vue';

import ComicPlus from '../es';
// console.log(ComicPlus);
import '../theme/index.css';
const app = createApp(App);
app.use(ComicPlus);

app.mount('#app');