import { Finder } from '../finder/Finder';
import { markAsAlreadyProcessed, textToImage } from './MutatorUtil';

export const DescriptionMutator = {
  async embedPlantUmlImages(finders: Finder[], webPageUrl: string, $root: JQuery<Node>) {
    await Promise.all(
      finders.map(async (finder) => {
        const contents = await finder.find(webPageUrl, $root);
        for (const content of contents) {
          // Skip if no PlantUML descriptions exist
          if (!content.text.length) continue;

          const $text = content.$text;

          // To avoid embedding an image multiple times
          if (!markAsAlreadyProcessed($text)) continue;
          const $image = await textToImage(content.text);
          $image.insertAfter($text);

          $text.on('dblclick', () => {
            $text.hide();
            $image.show();
          });
          $image.on('dblclick', () => {
            $image.hide();
            $text.show();
          });
          $text.dblclick();
        }
      })
    );
  },
};
