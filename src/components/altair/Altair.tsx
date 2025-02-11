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

  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-exp",
      generationConfig: {
        responseModalities: "audio",
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Aoede" } },
        },
      },
      systemInstruction: {
        parts: [
          {
            text: `You are my helpful assistant.
The sole purpose of our conversation is the following use case:
* A person has a specific product that this person needs to classify during your conversation session.
* In no particular order the person can take photos, use a video live stream and talk to you about this product and its properties to classify.
* The person has a textual table to view the current value of the properties.
* The person might not remember all the properties that should be identified and expects you to bring up the remaining properties that you haven't identified a value for.
* The person expects property values that are mentioned in voice to override those property values identified in the photos or video stream.

The following is advice on how to handle this use case:
* Any time you identify the value of one of the sought properties, call the appropriate function I have provided for you. This will update the person's textual UI for the person's reference.
* Don't bring up missing properties too early in the conversation but give the user a chance to go through them by themselves. When you feel that the user thinks they are done with the product classification and there are properties that don't have a value, then please ask the user for these one by one.
* Some images will contain **multiple items**. Focus on the **main garment** only.
* One item might be seen in **multiple images**.
* If you are unsure about certain details, feel free to **ask questions**.
* When the user indicates they are done with the classification, call the "complete_product_classification" function to complete the product classification.

The properties are:
* Product Category
* Size
* Color
* Material`,
          },
        ],
      },
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
      console.log(`got toolcall`, toolCall);
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
