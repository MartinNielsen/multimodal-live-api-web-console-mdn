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

const metadata = {
  "colors": {
    "1": "Aqua",
    "2": "Azure",
    "3": "Beige",
    "4": "Black",
    "5": "Blue",
    "6": "Bronze",
    "7": "Brown",
    "8": "Burgundy",
    "9": "Chocolate",
    "10": "Cream",
    "11": "Crimson",
    "12": "Coral",
    "13": "Cyan",
    "14": "Dark blue",
    "15": "Dark red",
    "16": "Golden",
    "17": "Gray",
    "18": "Green",
    "19": "Khaki",
    "20": "Light blue",
    "21": "Light green",
    "22": "Lime",
    "23": "Maroon",
    "24": "Mint",
    "25": "Mustard",
    "26": "Navy",
    "27": "Olive",
    "28": "Orange",
    "29": "Orchid",
    "30": "Pink",
    "31": "Purple",
    "32": "Red",
    "33": "Salmon",
    "34": "Silver",
    "35": "Spring green",
    "36": "Teal",
    "37": "Turquoise",
    "38": "Violet",
    "39": "Wheat",
    "40": "White",
    "41": "Yellow"
  },
  "categories": {
    "1": "Clothing",
    "2": "Shoes",
    "3": "Bags",
    "4": "Accessories",
    "5": "Ball gown",
    "6": "Belt",
    "7": "Blouse",
    "8": "Caftan",
    "9": "Cardigan",
    "10": "Coat",
    "11": "Dress",
    "12": "Hoodie",
    "13": "Jeans",
    "14": "Jumpsuit",
    "15": "Knitwear",
    "16": "Leather jacket",
    "17": "Lingerie",
    "18": "Shirt",
    "19": "Shorts",
    "20": "Skirt",
    "21": "Suit",
    "22": "Sweater",
    "23": "Swimwear",
    "24": "Top",
    "25": "Trenchcoat",
    "26": "Trousers",
    "27": "T-shirt",
    "28": "Vest",
    "29": "Ankle boots",
    "30": "Ballet flats",
    "31": "Boots",
    "32": "Clogs",
    "33": "Espadrilles",
    "34": "Flats",
    "35": "Flip-flops",
    "36": "High heels",
    "37": "Heels",
    "38": "Mid heels",
    "39": "Mules",
    "40": "Sandals",
    "41": "Shoes (general)",
    "42": "Slippers",
    "43": "Sneakers",
    "44": "Trainers",
    "45": "Backpack",
    "46": "Belt bag",
    "47": "Clutch",
    "48": "Crossbody bag",
    "49": "Handbag",
    "50": "Purse",
    "51": "Satchel",
    "52": "Shoulder bag",
    "53": "Suitcase",
    "54": "Tote bag",
    "55": "Bag (other)",
    "56": "Cap",
    "57": "Gloves",
    "58": "Handkerchief",
    "59": "Hat",
    "60": "Scarf",
    "61": "Sunglasses",
    "62": "Wallet",
    "63": "Watch",
    "64": "Accessory (other)"
  },
  "condition": {
    "1": "Never worn, with tag",
    "2": "Never worn",
    "3": "Very good",
    "4": "Good",
    "5": "Fair"
  },
  "pattern": {
    "1": "No pattern",
    "2": "Abstract",
    "3": "Abstract watercolour",
    "4": "Animal print",
    "5": "Argyle",
    "6": "Camouflage",
    "7": "Checkered/Plaid",
    "8": "Chevron",
    "9": "Damask",
    "10": "Floral",
    "11": "Galaxy print",
    "12": "Geometric",
    "13": "Gingham",
    "14": "Herringbone",
    "15": "Houndstooth",
    "16": "Ikat",
    "17": "Mosaic",
    "18": "Ombre",
    "19": "Paisley",
    "20": "Polka dots",
    "21": "Seersucker",
    "22": "Stripes",
    "23": "Tartan",
    "24": "Tie-dye",
    "25": "Toile de Jouy",
    "26": "Tribal"
  },
  "material": {
    "1": "Acrylic",
    "2": "Alpaca",
    "3": "Bamboo",
    "4": "Canvas",
    "5": "Cardboard",
    "6": "Cashmere",
    "7": "Ceramic",
    "8": "Chiffon",
    "9": "Corduroy",
    "10": "Cotton",
    "11": "Denim",
    "12": "Down",
    "13": "Elastane",
    "14": "Faux fur",
    "15": "Faux leather",
    "16": "Flannel",
    "17": "Fleece",
    "18": "Foam",
    "19": "Fur",
    "20": "Glass",
    "21": "Gold",
    "22": "Jute",
    "23": "Lace",
    "24": "Latex",
    "25": "Leather",
    "26": "Linen",
    "27": "Merino",
    "28": "Mesh",
    "29": "Metal",
    "30": "Mohair",
    "31": "Neoprene",
    "32": "Nylon",
    "33": "Paper",
    "34": "Plastic",
    "35": "Polyester",
    "36": "Porcelain",
    "37": "Rubber",
    "38": "Satin",
    "39": "Sequin",
    "40": "Silicone",
    "41": "Silk",
    "42": "Silver",
    "43": "Steel",
    "44": "Stone",
    "45": "Straw",
    "46": "Tweed",
    "47": "Velour",
    "48": "Velvet",
    "49": "Viscose",
    "50": "Wood",
    "51": "Wool"
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
      text: `You are my helpful assistant for a multimodal AI voice and video chat session whose sole purpose is to classify a clothing product.

Use Case:
- A user is classifying a specific product by providing photos, a live video stream, and voice input (in Swedish; however, you should always reply in English).
- The product has several properties that need to be identified and updated in a textual UI. When you determine or update a property, call the appropriate function to update the UI.
- Properties to classify:
  - Brand
  - Category (allowed: ${allowedCategories})
  - Color (allowed: ${allowedColors})
  - Condition (allowed: ${allowedCondition})
  - Material (allowed: ${allowedMaterial})
  - Pattern (allowed: ${allowedPattern})
  - Size

Key Instructions:
- Use only the allowed values specified above for their corresponding properties.
- Automatic Classification Start:
  - Begin the classification process as soon as you receive video or images—even if there has been no voice command to start.
- Input Prioritization:
  - If the user provides property details via voice, these values override any values previously identified from photos or video.
- Voice Responses:
  - Respond in English only.
  - Only provide voice responses when:
    - You are asked a direct question,
    - You need to ask a clarifying question, or
    - You need to provide a status update.
- Do not provide voice feedback on every image or video frame.
- Do not mention or summarize properties that are already registered unless the user explicitly asks for them.
- Handling Multiple Items and Images:
  - If an image contains multiple items, focus on the main garment.
  - The same item may appear in multiple images; treat them as belonging to the same product.
- Managing Missing Properties:
  - Avoid prompting the user about missing properties too early.
  - Allow the user to work through the classification, and only when the user indicates that they are finished (or seems ready) should you ask for any remaining property value one by one.
- Completion:
  - When the user signals that the classification is complete, call the complete_product_classification function to finalize the process.
- Clarifications:
  - If you are unsure about any details or need more information, feel free to ask the user clarifying questions.

Summary:
- Start classifying as soon as visual data (video/images) is received.
- Respond in English, even if the input is in Swedish.
- Only speak when necessary (questions, status updates, or clarifications) and never reiterate already registered properties unless asked.
- Update the UI immediately when a property is identified.
- Complete the classification with the complete_product_classification function when done.`
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
