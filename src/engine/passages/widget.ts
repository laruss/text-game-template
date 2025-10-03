import { Passage } from "@engine/passages/passage";
import { ReactNode } from "react";

export class Widget extends Passage {
    private readonly content: ReactNode;

    constructor(id: string, content: ReactNode) {
        super(id, "widget");
        this.content = content;
    }

    display() {
        return this.content;
    }
}

export const newWidget = (id: string, content: ReactNode) =>
    new Widget(id, content);
