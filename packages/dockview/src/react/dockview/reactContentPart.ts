import * as React from 'react';
import {
    IContentRenderer,
    GroupPanelContentPartInitParameters,
} from '../../groupview/types';
import { ReactPart, ReactPortalStore } from '../react';
import { IDockviewPanelProps } from '../dockview/dockview';
import { PanelUpdateEvent } from '../../panel/types';
import { IDockviewPanelApi } from '../../api/groupPanelApi';
import { DockviewApi } from '../../api/component.api';
import { GroupviewPanel } from '../../groupview/groupviewPanel';
import { Emitter, Event } from '../../events';
import { WrappedTab } from '../../dockview/components/tab/defaultTab';

export interface IGroupPanelActionbarProps {
    api: IDockviewPanelApi;
    containerApi: DockviewApi;
}

export interface ReactContentPartContext {
    api: IDockviewPanelApi;
    containerApi: DockviewApi;
    actionsPortalElement: HTMLElement;
    tabPortalElement: WrappedTab;
}

export class ReactPanelContentPart implements IContentRenderer {
    private _element: HTMLElement;
    private part?: ReactPart<IDockviewPanelProps>;
    private _group: GroupviewPanel | undefined;
    //
    private _actionsElement: HTMLElement;
    private actionsPart?: ReactPart<any>;

    private parameters: GroupPanelContentPartInitParameters | undefined;

    // private hostedContainer: HostedContainer;

    private readonly _onDidFocus = new Emitter<void>();
    readonly onDidFocus: Event<void> = this._onDidFocus.event;

    private readonly _onDidBlur = new Emitter<void>();
    readonly onDidBlur: Event<void> = this._onDidBlur.event;

    get element(): HTMLElement {
        return this._element;
    }

    get actions(): HTMLElement {
        return this._actionsElement;
    }

    constructor(
        public readonly id: string,
        private readonly component: React.FunctionComponent<IDockviewPanelProps>,
        private readonly reactPortalStore: ReactPortalStore
    ) {
        this._element = document.createElement('div');
        this._element.style.height = '100%';
        this._element.style.width = '100%';

        // this.hostedContainer = new HostedContainer({
        //     id,
        // });

        // this.hostedContainer.onDidFocus(() => this._onDidFocus.fire());
        // this.hostedContainer.onDidBlur(() => this._onDidBlur.fire());

        this._actionsElement = document.createElement('div');
        this._actionsElement.style.height = '100%';
        this._actionsElement.style.width = '100%';
    }

    focus() {
        // this._element.focus();
    }

    public init(parameters: GroupPanelContentPartInitParameters): void {
        this.parameters = parameters;

        // const api = parameters.api;

        // api.onDidVisibilityChange((event) => {
        //     const { isVisible } = event;

        //     if (isVisible) {
        //         this.hostedContainer.show();
        //     } else {
        //         this.hostedContainer.hide();
        //     }
        // });

        const context: ReactContentPartContext = {
            api: parameters.api,
            containerApi: parameters.containerApi,
            actionsPortalElement: this._actionsElement,
            tabPortalElement: this.parameters.tab,
        };

        this.part = new ReactPart(
            this.element,
            this.reactPortalStore,
            this.component,
            {
                ...parameters.params,
                api: parameters.api,
                containerApi: parameters.containerApi,
            },
            context
        );
    }

    public toJSON() {
        return {
            id: this.id,
        };
    }

    public update(params: PanelUpdateEvent) {
        if (this.parameters) {
            this.parameters.params = params.params;
        }

        this.part?.update(params.params);
    }

    public updateParentGroup(
        group: GroupviewPanel,
        isPanelVisible: boolean
    ): void {
        this._group = group;
    }

    public layout(width: number, height: number): void {
        // noop
        // this.hostedContainer.layout(
        //     this.element
        //     // { width, height }
        // );
    }

    public close(): Promise<boolean> {
        return Promise.resolve(true);
    }

    public dispose() {
        this.part?.dispose();
        // this.hostedContainer?.dispose();
        this.actionsPart?.dispose();
    }
}