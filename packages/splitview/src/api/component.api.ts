import {
    IDockviewComponent,
    LayoutDropEvent,
    SerializedDockview,
} from '../dockview/dockviewComponent';
import {
    AddGroupOptions,
    AddPanelOptions,
    MovementOptions,
    PanelOptions,
} from '../dockview/options';
import { Direction } from '../gridview/baseComponentGridview';
import {
    AddComponentOptions,
    IGridviewComponent,
    SerializedGridview,
} from '../gridview/gridviewComponent';
import { GridviewPanel } from '../gridview/gridviewPanel';
import { IGroupview } from '../groupview/groupview';
import { IGroupPanel } from '../groupview/groupviewPanel';
import {
    AddPaneviewCompponentOptions,
    SerializedPaneview,
} from '../paneview/paneviewComponent';
import { IPaneviewComponent } from '../paneview/paneviewComponent';
import { PaneviewPanel } from '../paneview/paneviewPanel';
import {
    AddSplitviewComponentOptions,
    ISplitviewPanels,
    SerializedSplitview,
} from '../splitview/splitviewComponent';
import { Orientation, Sizing } from '../splitview/core/splitview';
import { SplitviewPanel } from '../splitview/splitviewPanel';

export class SplitviewApi {
    get minimumSize() {
        return this.component.minimumSize;
    }

    get maximumSize() {
        return this.component.maximumSize;
    }

    get height() {
        return this.component.height;
    }

    get width() {
        return this.component.width;
    }

    get length() {
        return this.component.length;
    }

    get onDidLayoutChange() {
        return this.component.onDidLayoutChange;
    }

    constructor(private readonly component: ISplitviewPanels) {}

    removePanel(panel: SplitviewPanel, sizing?: Sizing) {
        this.component.removePanel(panel, sizing);
    }

    setVisible(panel: SplitviewPanel, isVisible: boolean) {
        return this.component.setVisible(panel, isVisible);
    }

    getPanels(): SplitviewPanel[] {
        return this.component.getPanels();
    }

    focus() {
        return this.component.focus();
    }

    getPanel(id: string) {
        return this.component.getPanel(id);
    }

    setActive(panel: SplitviewPanel) {
        return this.component.setActive(panel);
    }

    layout(width: number, height: number) {
        return this.component.layout(width, height);
    }

    addPanel(options: AddSplitviewComponentOptions) {
        return this.component.addPanel(options);
    }

    resizeToFit() {
        return this.component.resizeToFit();
    }

    movePanel(from: number, to: number) {
        this.component.movePanel(from, to);
    }

    fromJSON(data: SerializedSplitview) {
        return this.component.fromJSON(data);
    }

    toJSON() {
        return this.component.toJSON();
    }
}

export class PaneviewApi {
    get minimumSize() {
        return this.component.minimumSize;
    }

    get maximumSize() {
        return this.component.maximumSize;
    }

    get onDidLayoutChange() {
        return this.component.onDidLayoutChange;
    }

    constructor(private readonly component: IPaneviewComponent) {}

    getPanels(): PaneviewPanel[] {
        return this.component.getPanels();
    }

    removePanel(panel: PaneviewPanel): void {
        this.component.removePanel(panel);
    }

    getPanel(id: string): PaneviewPanel | undefined {
        return this.component.getPanel(id);
    }

    movePanel(from: number, to: number) {
        this.component.movePanel(from, to);
    }

    focus() {
        return this.component.focus();
    }

    layout(width: number, height: number) {
        return this.component.layout(width, height);
    }

    addPanel(options: AddPaneviewCompponentOptions) {
        return this.component.addPanel(options);
    }

    resizeToFit() {
        return this.component.resizeToFit();
    }

    fromJSON(data: SerializedPaneview) {
        return this.component.fromJSON(data);
    }

    toJSON() {
        return this.component.toJSON();
    }
}

export class GridviewApi {
    get minimumHeight() {
        return this.component.minimumHeight;
    }

    get maximumHeight() {
        return this.component.maximumHeight;
    }

    get minimumWidth() {
        return this.component.minimumWidth;
    }

    get maximumWidth() {
        return this.component.maximumWidth;
    }

    get onGridEvent() {
        return this.component.onGridEvent;
    }

    constructor(private readonly component: IGridviewComponent) {}

    get orientation() {
        return this.component.orientation;
    }

    set orientation(value: Orientation) {
        this.component.orientation = value;
    }

    focus() {
        return this.component.focus();
    }

    layout(width: number, height: number, force = false) {
        return this.component.layout(width, height, force);
    }

    addPanel(options: AddComponentOptions) {
        return this.component.addPanel(options);
    }

    removePanel(panel: GridviewPanel, sizing?: Sizing): void {
        this.component.removePanel(panel, sizing);
    }

    movePanel(
        panel: GridviewPanel,
        options: { direction: Direction; reference: string; size?: number }
    ) {
        this.component.movePanel(panel, options);
    }

    resizeToFit() {
        return this.component.resizeToFit();
    }

    getPanel(id: string) {
        return this.component.getPanel(id);
    }

    toggleVisibility(panel: GridviewPanel) {
        return this.component.toggleVisibility(panel);
    }

    isVisible(panel: GridviewPanel) {
        return this.component.isVisible(panel);
    }

    setVisible(panel: GridviewPanel, visible: boolean) {
        return this.component.setVisible(panel, visible);
    }

    fromJSON(data: SerializedGridview) {
        return this.component.fromJSON(data);
    }

    toJSON() {
        return this.component.toJSON();
    }
}

export class DockviewApi {
    get minimumHeight() {
        return this.component.minimumHeight;
    }

    get maximumHeight() {
        return this.component.maximumHeight;
    }

    get minimumWidth() {
        return this.component.minimumWidth;
    }

    get maximumWidth() {
        return this.component.maximumWidth;
    }

    get size() {
        return this.component.size;
    }

    get totalPanels() {
        return this.component.totalPanels;
    }

    get onGridEvent() {
        return this.component.onGridEvent;
    }

    get onDidLayoutChange() {
        return this.component.onDidLayoutChange;
    }

    constructor(private readonly component: IDockviewComponent) {}

    focus() {
        return this.component.focus();
    }

    getPanel(id: string): IGroupPanel | undefined {
        return this.component.getGroupPanel(id);
    }

    setActivePanel(panel: IGroupPanel) {
        return this.component.setActivePanel(panel);
    }

    layout(width: number, height: number, force = false) {
        return this.component.layout(width, height, force);
    }

    addPanel(options: AddPanelOptions) {
        return this.component.addPanel(options);
    }

    addDndHandle(type: string, cb: (event: LayoutDropEvent) => PanelOptions) {
        return this.component.addDndHandle(type, cb);
    }

    createDragTarget(
        target: {
            element: HTMLElement;
            content: string;
        },
        options: (() => PanelOptions) | PanelOptions
    ) {
        return this.component.createDragTarget(target, options);
    }

    addEmptyGroup(options?: AddGroupOptions) {
        return this.component.addEmptyGroup(options);
    }

    moveToNext(options?: MovementOptions) {
        return this.component.moveToNext(options);
    }

    moveToPrevious(options?: MovementOptions) {
        return this.component.moveToPrevious(options);
    }

    closeAllGroups() {
        return this.component.closeAllGroups();
    }

    removeGroup(group: IGroupview) {
        return this.component.removeGroup(group);
    }

    resizeToFit() {
        return this.component.resizeToFit();
    }

    getTabHeight() {
        return this.component.getTabHeight();
    }

    setTabHeight(height: number | undefined) {
        this.component.setTabHeight(height);
    }

    getGroup(id: string) {
        return this.component.getPanel(id);
    }

    fromJSON(data: SerializedDockview) {
        return this.component.fromJSON(data);
    }

    toJSON() {
        return this.component.toJSON();
    }
}
