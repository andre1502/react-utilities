import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import { OutputOptions } from '../interfaces/Config/OutputOptions';
import { SitemapMap } from '../interfaces/Config/SitemapMap';
import { outputToFile } from './Output';

/**
 * Generate Sitemap Robots
 *
 * @param {string} hostname
 * @param {OutputOptions} options
 * @return {void}
 */
const generateRobots = (hostname: string, options: OutputOptions): void => {
  let content = [
    '# https://www.robotstxt.org/robotstxt.html',
    `Sitemap: ${hostname}/${options.filename}`,
    'User-agent: *',
    'Disallow:',
  ];

  options.filename = 'robots.txt';

  outputToFile(content.join('\r\n'), options);
};

/**
 * Transform Sitemap
 *
 * @param {string} hostname
 * @param {SitemapMap[]} urls
 * @param {boolean} includeRobots
 * @param {OutputOptions} options
 * @return {Promise<void>}
 */
const transformSitemap = async (
  hostname: string,
  urls: SitemapMap[],
  includeRobots: boolean,
  options: OutputOptions,
): Promise<void> => {
  const stream = new SitemapStream({
    hostname: hostname,
    lastmodDateOnly: false,
    xmlns: {
      news: false,
      xhtml: false,
      image: false,
      video: false,
      custom: [
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
        'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd"',
      ],
    },
  });
  const content = await streamToPromise(Readable.from(urls).pipe(stream)).then(
    (data) => data.toString(),
  );

  outputToFile(content, options);

  if (includeRobots) {
    generateRobots(hostname, options);
  }
};

export { transformSitemap };
