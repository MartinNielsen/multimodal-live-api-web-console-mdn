/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

// Updated metadata with Swedish translations
const metadata = {
  "colors": {
    "1": "Akva",
    "2": "Azur",
    "3": "Beige",
    "4": "Svart",
    "5": "Blå",
    "6": "Brons",
    "7": "Brun",
    "8": "Bourgogne",
    "9": "Choklad",
    "10": "Grädde",
    "11": "Karmosin",
    "12": "Korall",
    "13": "Cyan",
    "14": "Mörkblå",
    "15": "Mörkröd",
    "16": "Gylden",
    "17": "Grå",
    "18": "Grön",
    "19": "Khaki",
    "20": "Ljusblå",
    "21": "Ljusgrön",
    "22": "Lime",
    "23": "Maroon",
    "24": "Mint",
    "25": "Senap",
    "26": "Marinblå",
    "27": "Oliv",
    "28": "Orange",
    "29": "Orkidé",
    "30": "Rosa",
    "31": "Lila",
    "32": "Röd",
    "33": "Laxrosa",
    "34": "Silver",
    "35": "Vårgrön",
    "36": "Blågrön",
    "37": "Turkos",
    "38": "Violon",
    "39": "Vetefärgad",
    "40": "Vit",
    "41": "Gul"
  },
  "categories": {
    "1": "Kläder",
    "2": "Skor",
    "3": "Väskor",
    "4": "Accessoarer",
    "5": "Aftonklänning",
    "6": "Bälte",
    "7": "Blus",
    "8": "Kaftan",
    "9": "Cardigan",
    "10": "Kappa",
    "11": "Klänning",
    "12": "Huvtröja",
    "13": "Jeans",
    "14": "Overall",
    "15": "Stickat",
    "16": "Läderjacka",
    "17": "Underkläder",
    "18": "Skjorta",
    "19": "Shorts",
    "20": "Kjol",
    "21": "Kostym",
    "22": "Tröja",
    "23": "Badkläder",
    "24": "Topp",
    "25": "Trenchcoat",
    "26": "Byxor",
    "27": "T-shirt",
    "28": "Väst",
    "29": "Ankelstövlar",
    "30": "Balettskor",
    "31": "Stövlar",
    "32": "Träskor",
    "33": "Espadriller",
    "34": "Platta skor",
    "35": "Flip-flops",
    "36": "Höga klackar",
    "37": "Klackar",
    "38": "Mellanklackar",
    "39": "Mules",
    "40": "Sandaler",
    "41": "Skor (allmänt)",
    "42": "Tofflor",
    "43": "Sneakers",
    "44": "Träningsskor",
    "45": "Ryggsäck",
    "46": "Bältesväska",
    "47": "Aftonväska",
    "48": "Axelremsväska",
    "49": "Handväska",
    "50": "Plånbok",
    "51": "Skolväska",
    "52": "Skulderväska",
    "53": "Resväska",
    "54": "Shoppingväska",
    "55": "Väska (övrig)",
    "56": "Keps",
    "57": "Handskar",
    "58": "Näsdukar",
    "59": "Hatt",
    "60": "Halsduk",
    "61": "Solglasögon",
    "62": "Plånbok",
    "63": "Klocka",
    "64": "Accessoar (övrig)"
  },
  "condition": {
    "1": "Aldrig använd, med märke",
    "2": "Aldrig använd",
    "3": "Mycket bra",
    "4": "Bra",
    "5": "Rättvis"
  },
  "pattern": {
    "1": "Inget mönster",
    "2": "Abstrakt",
    "3": "Abstrakt akvarell",
    "4": "Djurtryck",
    "5": "Argyle",
    "6": "Kamouflage",
    "7": "Rutig",
    "8": "Chevron",
    "9": "Damask",
    "10": "Blommig",
    "11": "Galaxtryck",
    "12": "Geometrisk",
    "13": "Gingham",
    "14": "Fiskbensmönster",
    "15": "Hundtand",
    "16": "Ikat",
    "17": "Mosaik",
    "18": "Ombre",
    "19": "Paisley",
    "20": "Prickar",
    "21": "Seersucker",
    "22": "Ränder",
    "23": "Tartan",
    "24": "Tie-dye",
    "25": "Toile de Jouy",
    "26": "Tribal"
  },
  "material": {
    "1": "Akryl",
    "2": "Alpacka",
    "3": "Bambu",
    "4": "Canvas",
    "5": "Kartong",
    "6": "Kashmir",
    "7": "Keramik",
    "8": "Chiffong",
    "9": "Manchestertyg",
    "10": "Bomull",
    "11": "Denim",
    "12": "Dun",
    "13": "Elastan",
    "14": "Fuskpäls",
    "15": "Konstläder",
    "16": "Flanell",
    "17": "Fleece",
    "18": "Skum",
    "19": "Päls",
    "20": "Glas",
    "21": "Guld",
    "22": "Jute",
    "23": "Spets",
    "24": "Latex",
    "25": "Läder",
    "26": "Linne",
    "27": "Merino",
    "28": "Mesh",
    "29": "Metall",
    "30": "Mohair",
    "31": "Neopren",
    "32": "Nylon",
    "33": "Papper",
    "34": "Plast",
    "35": "Polyester",
    "36": "Porslin",
    "37": "Gummi",
    "38": "Satin",
    "39": "Paljett",
    "40": "Silikon",
    "41": "Siden",
    "42": "Silver",
    "43": "Stål",
    "44": "Sten",
    "45": "Halm",
    "46": "Tweed",
    "47": "Velour",
    "48": "Sammet",
    "49": "Viskos",
    "50": "Trä",
    "51": "Ull"
  }
};

const allowedColors = Object.values(metadata.colors).join(", ");
const allowedCategories = Object.values(metadata.categories).join(", ");
const allowedCondition = Object.values(metadata.condition).join(", ");
const allowedPattern = Object.values(metadata.pattern).join(", ");
const allowedMaterial = Object.values(metadata.material).join(", ");

const declaration: FunctionDeclaration = {
  name: "render_altair",
  description: "Displays an altair graph in json format.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description:
          "JSON STRING representation of the graph to render. Must be a string, not a json object",
      },
    },
    required: ["json_graph"],
  },
};

const propertyUpdateFunctionCallDeclaration1: FunctionDeclaration = {
  name: "upsert_product_property_color",
  description: "Sets or updates the color property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      color: {
        type: SchemaType.STRING,
        description:
          "STRING value of the color in english. Must be a string, not a json object",
      },
    },
    required: ["color"],
  },
};

const propertyUpdateFunctionCallDeclaration2: FunctionDeclaration = {
  name: "upsert_product_property_product_category",
  description: "Sets or updates the product category property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      product_category: {
        type: SchemaType.STRING,
        description:
          "STRING value of the product category in english. Must be a string, not a json object",
      },
    },
    required: ["product_category"],
  },
};

const propertyUpdateFunctionCallDeclaration3: FunctionDeclaration = {
  name: "upsert_product_property_size",
  description: "Sets or updates the size property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      size: {
        type: SchemaType.STRING,
        description:
          "STRING value of the size. Must be a string, not a json object",
      },
    },
    required: ["size"],
  },
};

const propertyUpdateFunctionCallDeclaration4: FunctionDeclaration = {
  name: "upsert_product_property_material",
  description: "Sets or updates the material property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      material: {
        type: SchemaType.STRING,
        description:
          "STRING value of the material in english. Must be a string, not a json object",
      },
    },
    required: ["material"],
  },
};

// New declarations for missing properties
const propertyUpdateFunctionCallDeclarationBrand: FunctionDeclaration = {
  name: "upsert_product_property_brand",
  description: "Sets or updates the brand property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      brand: {
        type: SchemaType.STRING,
        description:
          "STRING value of the brand in english. Must be a string, not a json object",
      },
    },
    required: ["brand"],
  },
};

const propertyUpdateFunctionCallDeclarationCondition: FunctionDeclaration = {
  name: "upsert_product_property_condition",
  description: "Sets or updates the condition property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      condition: {
        type: SchemaType.STRING,
        description:
          "STRING value of the condition in english. Must be a string, not a json object",
      },
    },
    required: ["condition"],
  },
};

const propertyUpdateFunctionCallDeclarationPattern: FunctionDeclaration = {
  name: "upsert_product_property_pattern",
  description: "Sets or updates the pattern property of the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      pattern: {
        type: SchemaType.STRING,
        description:
          "STRING value of the pattern in english. Must be a string, not a json object",
      },
    },
    required: ["pattern"],
  },
};

const completeProductClassification: FunctionDeclaration = {
  name: "complete_product_classification",
  description: "Called when the user is done with classifying the product.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      success: {
        type: SchemaType.BOOLEAN,
        description: "A true or false value indicating if the classification was successful.",
      },
    },
    required: ["success"],
  },
};

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();
const systemInstruction = {
  parts: [
    {
      text: `Du är min hjälpsamma assistent för en multimodal AI-röst- och videochatt-session vars enda syfte är att klassificera en klädprodukt.

Användningsfall:
- En användare klassificerar en specifik produkt genom att tillhandahålla foton, en livevideoström och röstinmatning (på svenska; dock ska du alltid svara på engelska).
- Produkten har flera egenskaper som måste identifieras och uppdateras i ett textuellt användargränssnitt. När du bestämmer eller uppdaterar en egenskap, ring den lämpliga funktionen för att uppdatera användargränssnittet.
- Egenskaper att klassificera:
  - Märke
  - Kategori (tillåtet: ${allowedCategories})
  - Färg (tillåtet: ${allowedColors})
  - Skick (tillåtet: ${allowedCondition})
  - Material (tillåtet: ${allowedMaterial})
  - Mönster (tillåtet: ${allowedPattern})
  - Storlek

Viktiga instruktioner:
- Använd endast de tillåtna värdena som anges ovan för deras motsvarande egenskaper.
- Automatisk klassificeringsstart:
  - Börja klassificeringsprocessen så snart du får video eller bilder – även om det inte har funnits någon röstkommando att starta.
- Inmatningsprioritering:
  - Om användaren tillhandahåller egenskapsdetaljer via röst, åsidosätter dessa värden alla värden som tidigare identifierats från foton eller video.
- Röstrespons:
  - Svara endast på engelska.
  - Ge endast röstrespons när:
    - Du får en direkt fråga,
    - Du behöver ställa en förtydligande fråga, eller
    - Du behöver ge en statusuppdatering.
- Ge inte röstfeedback på varje bild eller videoruta.
- Nämn eller sammanfatta inte egenskaper som redan är registrerade om inte användaren uttryckligen ber om dem.
- Hantering av flera objekt och bilder:
  - Om en bild innehåller flera objekt, fokusera på huvudplagget.
  - Samma objekt kan visas i flera bilder; behandla dem som tillhörande samma produkt.
- Hantering av saknade egenskaper:
  - Undvik att fråga användaren om saknade egenskaper för tidigt.
  - Låt användaren arbeta igenom klassificeringen, och först när användaren indikerar att de är klara (eller verkar redo) bör du fråga efter eventuella återstående egenskapsvärden en efter en.
- Slutförande:
  - När användaren signalerar att klassificeringen är klar, ring funktionen complete_product_classification för att slutföra processen.
- Förtydliganden:
  - Om du är osäker på några detaljer eller behöver mer information, tveka inte att fråga användaren förtydligande frågor.

Sammanfattning:
- Börja klassificera så snart visuell data (video/bilder) tas emot.
- Svara på engelska, även om inmatningen är på svenska.
- Tala endast när det är nödvändigt (frågor, statusuppdateringar eller förtydliganden) och upprepa aldrig redan registrerade egenskaper om inte ombedd.
- Uppdatera användargränssnittet omedelbart när en egenskap identifieras.
- Slutför klassificeringen med funktionen complete_product_classification när den är klar.`
    }
  ]
};

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction,
      tools: [
        // there is a free-tier quota for search
        { googleSearch: {} },
        { 
          functionDeclarations: [
            propertyUpdateFunctionCallDeclarationBrand,            // brands
            propertyUpdateFunctionCallDeclaration2,                  // categories
            propertyUpdateFunctionCallDeclaration1,                  // colors
            propertyUpdateFunctionCallDeclarationCondition,          // conditions
            propertyUpdateFunctionCallDeclaration4,                  // materials
            propertyUpdateFunctionCallDeclarationPattern,            // patterns
            propertyUpdateFunctionCallDeclaration3,                  // sizes
            completeProductClassification
          ]
        },
        //{ functionDeclarations: [declaration] },
      ],
    });
  }, [setConfig]);

  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      //console.log(`got toolcall`, toolCall);
      // Updated logging: concatenate function call arguments with commas.
      toolCall.functionCalls.forEach(fc => {
        const args = fc.args || {};
        const argsString = Object.entries(args)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
        console.log(`Function: ${fc.name}(${argsString})`);
      });
      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name,
      );
      if (fc) {
        const str = (fc.args as any).json_graph;
        setJSONString(str);
      }
      // send data for the response of your tool call
      // in this case Im just saying it was successful
      if (toolCall.functionCalls.length) {
        setTimeout(
          () =>
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            }),
          200,
        );
      }
    };
    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  const embedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (embedRef.current && jsonString) {
      vegaEmbed(embedRef.current, JSON.parse(jsonString));
    }
  }, [embedRef, jsonString]);
  return <div className="vega-embed" ref={embedRef} />;
}

export const Altair = memo(AltairComponent);
