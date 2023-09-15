import { Request, Response, NextFunction } from "express";
import { Schema, ValidationError } from "joi";

class ValidationMiddleware {
  schemas: { [key: string]: Schema };

  constructor(schemas: { [key: string]: Schema }) {
    this.schemas = schemas;
  }

  validateBody = (schemaKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const schema = this.schemas[schemaKey];

      if (!schema) {
        console.error("Schema not found");
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const { error } = schema.validate(req.body);

      if (error) {
        const { details } = error as ValidationError;
        const message = details?.map((i) => i.message).join(",");
        res.status(422).json({ error: message });
      } else {
        next();
      }
    };
  };
  validateParams = (schemaKey: string) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const schema = this.schemas[schemaKey];

      if (!schema) {
        console.error("Schema not found");
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const { error } = schema.validate(req.params);

      if (error) {
        const { details } = error as ValidationError;
        const message = details?.map((i) => i.message).join(",");
        res.status(422).json({ error: message });
      } else {
        next();
      }
    };
  };
}

export default ValidationMiddleware;
