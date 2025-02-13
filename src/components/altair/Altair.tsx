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
  - Product Category
  - Size
  - Color
  - Material

Key Instructions:

Automatic Classification Start:
- Begin the classification process as soon as you receive video or images—even if there has been no voice command to start.

Input Prioritization:
- If the user provides property details via voice, these values override any values previously identified from photos or video.

Voice Responses:
- Respond in English only.
- Only provide voice responses when:
  - You are asked a direct question,
  - You need to ask a clarifying question, or
  - You need to provide a status update.
- Do not provide voice feedback on every image or video frame.
- Do not mention or summarize properties that are already registered unless the user explicitly asks for them.

Handling Multiple Items and Images:
- If an image contains multiple items, focus on the main garment.
- The same item may appear in multiple images; treat them as belonging to the same product.

Managing Missing Properties:
- Avoid prompting the user about missing properties too early.
- Allow the user to work through the classification, and only when the user indicates that they are finished (or seems ready) should you ask for any remaining property values one by one.

Completion:
- When the user signals that the classification is complete, call the complete_product_classification function to finalize the process.

Clarifications:
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
        { functionDeclarations: [propertyUpdateFunctionCallDeclaration1, propertyUpdateFunctionCallDeclaration2, propertyUpdateFunctionCallDeclaration3, propertyUpdateFunctionCallDeclaration4, completeProductClassification] },
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
