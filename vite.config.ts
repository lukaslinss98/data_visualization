import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        'src/pages/johnsnow/johnsnow': 'src/pages/johnsnow/johnsnow.html',
        'src/pages/minard/minard': 'src/pages/minard/minard.html',
        'src/pages/gapminder/objectiveASize': 'src/pages/gapminder/objectiveASize.html',
        'src/pages/gapminder/objectiveABrightness': 'src/pages/gapminder/objectiveABrightness.html',
        'src/pages/gapminder/objectiveAColor': 'src/pages/gapminder/objectiveAColor.html',
        'src/pages/gapminder/objectiveBColor': 'src/pages/gapminder/objectiveBColor.html',
        'src/pages/gapminder/objectiveBShape': 'src/pages/gapminder/objectiveBShape.html',
        'src/pages/gapminder/objectiveBPosition': 'src/pages/gapminder/objectiveBPosition.html',
        'src/pages/gapminder/objectiveC': 'src/pages/gapminder/objectiveC.html',
        'src/pages/irishpropertysales/irishPropertySales': 'src/pages/irishpropertysales/irishPropertySales.html',
      },
    },
  },
});