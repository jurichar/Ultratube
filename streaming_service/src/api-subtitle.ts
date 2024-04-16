import fs from "fs";
import path from "path";
import got from "got";
import pMap from "p-map";
import streamz from "streamz";
import { Parse as unzipper } from "unzipper";
import srt2vtt from "srt-to-vtt";
import * as cheerio from "cheerio";

const langsFormat = {
  sq: "albanian",
  ar: "arabic",
  bn: "bengali",
  pb: "brazilian-portuguese",
  bg: "bulgarian",
  zh: "chinese",
  hr: "croatian",
  cs: "czech",
  da: "danish",
  nl: "dutch",
  en: "english",
  et: "estonian",
  ir: "farsi/persian",
  fi: "finnish",
  fr: "french",
  de: "german",
  el: "greek",
  he: "hebrew",
  hu: "hungarian",
  id: "indonesian",
  it: "italian",
  ja: "japanese",
  ko: "korean",
  lt: "lithuanian",
  mk: "macedonian",
  ms: "malay",
  no: "norwegian",
  pl: "polish",
  pt: "portuguese",
  ro: "romanian",
  ru: "russian",
  sr: "serbian",
  sl: "slovenian",
  es: "spanish",
  sv: "swedish",
  th: "thai",
  tr: "turkish",
  ur: "urdu",
  uk: "ukrainian",
  vi: "vietnamese",
};

const yifysubtitles = (imdbId, opts) => {
  opts = Object.assign(
    {
      path: path.resolve(),
      langs: ["en"],
      concurrency: Infinity,
      format: "vtt",
    },
    opts
  );

  if (!Array.isArray(opts.langs)) {
    throw new TypeError("Expected `langs` to be an array");
  } else if (opts.langs.some((lang) => !langsFormat.hasOwnProperty(lang))) {
    throw new TypeError(`Expected \`langs\` members to be in ${Object.keys(langsFormat)}`);
  }

  const langFilter = (subs, langs) => {
    const data = langs.reduce((acc, l) => {
      const lang = subs.filter((s) => s.language === l).sort((a, b) => b.rating - a.rating);
      if (lang.length > 0) {
        acc[l] = lang[0];
      }
      return acc;
    }, {});
    return data;
  };

  const downloadFormat = (format) => (lang, url, link) => {
    let writed = "";
    let fullPath = "";

    return got
      .stream(url)
      .pipe(unzipper())
      .pipe(
        streamz((entry) => {
          const parsedPath = path.parse(entry.path);
          const escapedLang = lang.replace("/", "-");
          entry.path = entry.path.replace(/\s+/g, ".").replace(parsedPath.ext, `_${escapedLang}_${parsedPath.ext}`);
          if (parsedPath.dir === "" && parsedPath.ext === ".srt") {
            writed = format === "srt" ? entry.path : entry.path.replace("srt", "vtt");
            fullPath = path.join(link, writed);
            return format === "srt" ? entry.pipe(fs.createWriteStream(fullPath)) : entry.pipe(srt2vtt()).pipe(fs.createWriteStream(fullPath));
          }
          entry.autodrain();
        })
      )
      .promise()
      .then(() => ({
        lang,
        langShort: getKeyByValue(langsFormat, lang),
        path: fullPath,
        fileName: writed,
      }));
  };
  function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
  }
  const downloads = (res, opts) => {
    const download = downloadFormat(opts.format);
    const { concurrency, path: downloadPath } = opts;

    return pMap(Object.keys(res), (lang) => download(lang, res[lang].url, downloadPath), { concurrency });
  };

  const runConditional = (imdbId, opts, res) => {
    return Promise.resolve(
      langFilter(
        res,
        opts.langs.map((lang) => langsFormat[lang])
      )
    ).then((filteredRes) => downloads(filteredRes, opts));
  };

  const scrape = (imdbId) => {
    return got(`https://www.yifysubtitles.org/movie-imdb/${imdbId}`)
      .then((res) => cheerio.load(res.body))
      .then(($) => {
        return $("tbody tr")
          .map((i, el) => {
            const $el = $(el);
            const tdWithoutClass = $el.find("td:not([class])"); // Rechercher un <td> sans classe
            const hrefValue = tdWithoutClass.find("a").attr("href");
            return {
              rating: $el.find(".rating-cell").text(),
              language: $el.find(".flag-cell .sub-lang").text().toLowerCase(),
              url: "https://www.yifysubtitles.org" + hrefValue.replace("subtitles/", "subtitle/") + ".zip",
            };
          })
          .get();
      });
  };

  return scrape(imdbId).then((subtitles) => (subtitles.length > 0 ? runConditional(imdbId, opts, subtitles) : []));
};

export default yifysubtitles;
