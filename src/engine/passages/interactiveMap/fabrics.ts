import { callIfFunction } from "@engine/helpers";
import { OptionalCallable } from "@engine/types";

import { InteractiveMap } from "./interactiveMap";
import {
    InteractiveMapOptions, LabelHotspot,
    MapImageHotspot,
    MapLabelHotspot, MapMenu,
    SideImageHotspot,
    SideLabelHotspot,
} from "./types";

export const newInteractiveMap = (
    id: string,
    options: InteractiveMapOptions
): InteractiveMap => new InteractiveMap(id, options);

export const newMapLabelHotspot = (
    hotspot: MapLabelHotspot | OptionalCallable<MapLabelHotspot>
) => () => callIfFunction(hotspot);

export const newMapImageHotspot = (
    hotspot: MapImageHotspot | OptionalCallable<MapImageHotspot>
) => () => callIfFunction(hotspot);

export const newSideLabelHotspot = (
    hotspot: SideLabelHotspot | OptionalCallable<SideLabelHotspot>
) => () => callIfFunction(hotspot);

export const newSideImageHotspot = (
    hotspot: SideImageHotspot | OptionalCallable<SideImageHotspot>
) => () => callIfFunction(hotspot);

export const newMapMenu = (
    menu: MapMenu | OptionalCallable<MapMenu>
) => () => callIfFunction(menu);

export const newMapMenuItem = (
    item: LabelHotspot | OptionalCallable<LabelHotspot>
) => () => callIfFunction(item);
