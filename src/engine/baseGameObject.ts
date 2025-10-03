import { Game } from "@engine/game";
import { Storage } from "@engine/storage";
import { InitVarsType, JsonPath } from "@engine/types";
import { snapshot } from "valtio";

export class BaseGameObject<VariablesType extends InitVarsType = InitVarsType> {
    private static jsonPath: JsonPath = "$.";
    readonly id: string;
    protected _variables: VariablesType;

    constructor(props: { id: string; variables?: VariablesType }) {
        this.id = props.id;
        this._variables = props.variables || ({} as VariablesType);
        Game.registerEntity(this);
    }

    get variables(): VariablesType {
        return this._variables;
    }

    private get path() {
        return `${BaseGameObject.jsonPath}${this.id}` as JsonPath;
    }

    // get variables from the game state
    load() {
        const loadedVariables = Storage.getValue(this.path);
        if (loadedVariables.length > 0) {
            Object.assign(this._variables, loadedVariables[0] as VariablesType);
        } else {
            for (const key in this._variables) {
                delete this._variables[key];
            }
        }
        console.log(
            `Object ${this.id} loaded variables:`,
            snapshot(this._variables)
        );
    }

    // save variables to the game state
    save() {
        Storage.setValue(this.path, snapshot(this._variables));
        console.log(
            `Object ${this.id} saved variables:`,
            snapshot(this._variables)
        );
    }
}
