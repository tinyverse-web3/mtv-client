import presetAttributify from '@unocss/preset-attributify';
import presetUno from '@unocss/preset-uno';
import { defineConfig } from 'unocss';
import presetIcons from '@unocss/preset-icons';

export default defineConfig({
  presets: [presetUno(), presetAttributify(), presetIcons()],
});
