import type { Entity, EntityField } from "../types";

/**
 * Generates sample data for an entity based on its fields
 */
function generateSampleData(entity: Entity, count: number = 3): any[] {
  if (!entity.fields || entity.fields.length === 0) {
    return [];
  }

  const sampleData: any[] = [];

  for (let i = 1; i <= count; i++) {
    const sample: any = {};

    entity.fields.forEach((field) => {
      sample[field.name] = generateFieldValue(field, i, entity.name);
    });

    sampleData.push(sample);
  }

  return sampleData;
}

/**
 * Generates a sample value for a specific field based on its type
 */
function generateFieldValue(
  field: EntityField,
  index: number,
  entityName: string
): any {
  const { type, name } = field;

  switch (type) {
    case "number":
      if (name.toLowerCase().includes("id")) {
        return index;
      }
      if (name.toLowerCase().includes("age")) {
        return 20 + index * 5;
      }
      if (
        name.toLowerCase().includes("price") ||
        name.toLowerCase().includes("cost")
      ) {
        return parseFloat((99.99 + index * 10).toFixed(2));
      }
      if (
        name.toLowerCase().includes("quantity") ||
        name.toLowerCase().includes("count")
      ) {
        return index * 10;
      }
      return index * 100;

    case "text": {
      if (name.toLowerCase().includes("name")) {
        const names = [
          "John Doe",
          "Jane Smith",
          "Mike Johnson",
          "Sarah Wilson",
          "David Brown",
        ];
        return names[(index - 1) % names.length];
      }
      if (name.toLowerCase().includes("title")) {
        const titles = [
          "Sample Title",
          "Example Title",
          "Demo Title",
          "Test Title",
          "Mock Title",
        ];
        return titles[(index - 1) % titles.length];
      }
      if (name.toLowerCase().includes("description")) {
        return `Sample description for ${entityName} ${index}`;
      }
      if (name.toLowerCase().includes("address")) {
        const addresses = [
          "123 Main St",
          "456 Oak Ave",
          "789 Pine Rd",
          "321 Elm Dr",
          "654 Maple Ln",
        ];
        return addresses[(index - 1) % addresses.length];
      }
      if (name.toLowerCase().includes("city")) {
        const cities = [
          "New York",
          "Los Angeles",
          "Chicago",
          "Houston",
          "Phoenix",
        ];
        return cities[(index - 1) % cities.length];
      }
      if (name.toLowerCase().includes("phone")) {
        return `(555) ${String(123 + index).padStart(3, "0")}-${String(
          4567 + index
        ).padStart(4, "0")}`;
      }
      return `Sample ${name} ${index}`;
    }

    case "email": {
      const emailNames = [
        "john.doe",
        "jane.smith",
        "mike.johnson",
        "sarah.wilson",
        "david.brown",
      ];
      const domains = [
        "example.com",
        "test.org",
        "demo.net",
        "sample.io",
        "mock.co",
      ];
      const emailName = emailNames[(index - 1) % emailNames.length];
      const domain = domains[(index - 1) % domains.length];
      return `${emailName}${index > emailNames.length ? index : ""}@${domain}`;
    }

    case "boolean":
      return index % 2 === 1;

    case "date": {
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + index * 7); // Add weeks
      return baseDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    }

    case "select":
      if (field.validation?.options && field.validation.options.length > 0) {
        return field.validation.options[
          (index - 1) % field.validation.options.length
        ];
      }
      return `Option ${index}`;

    case "textarea":
      if (name.toLowerCase().includes("description")) {
        return `This is a detailed description for ${entityName} ${index}. It contains multiple sentences and provides comprehensive information about the item or entity. This is sample content that demonstrates how longer text fields would appear.`;
      }
      if (name.toLowerCase().includes("comment")) {
        return `Sample comment ${index}: This is a multi-line comment that provides additional context and information.`;
      }
      if (name.toLowerCase().includes("note")) {
        return `Note ${index}: Important information that should be remembered about this ${entityName}.`;
      }
      return `Sample ${name} content ${index}.\n\nThis is a multi-line text area with detailed information.`;

    default:
      return `Sample ${name} ${index}`;
  }
}

/**
 * Updates an entity with freshly generated sample data
 */
export function updateEntityWithSampleData(
  entity: Entity,
  count: number = 3
): Entity {
  return {
    ...entity,
    examples: generateSampleData(entity, count),
  };
}

/**
 * Checks if an entity needs sample data regeneration
 */
export function needsSampleDataUpdate(entity: Entity): boolean {
  if (!entity.examples || entity.examples.length === 0) {
    return true;
  }

  // Check if the sample data fields match the current entity fields
  const sampleFields =
    entity.examples.length > 0 ? Object.keys(entity.examples[0]) : [];
  const entityFields = entity.fields?.map((f) => f.name) || [];

  // If field names don't match, regenerate
  if (sampleFields.length !== entityFields.length) {
    return true;
  }

  return !sampleFields.every((field) => entityFields.includes(field));
}
