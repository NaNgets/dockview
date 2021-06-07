import { DockviewApi } from '../api/component.api';
import { DockviewPanelApiImpl } from '../api/groupPanelApi';
import { Event } from '../events';
import {
    GroupPanelUpdateEvent,
    GroupviewPanelState,
    IGroupPanel,
    IGroupPanelInitParameters,
} from '../groupview/groupPanel';
import { GroupChangeKind } from '../groupview/groupview';
import { GroupviewPanel } from '../groupview/groupviewPanel';
import { CompositeDisposable, MutableDisposable } from '../lifecycle';
import { Parameters } from '../panel/types';
import { IGroupPanelView } from './defaultGroupPanelView';

export class DockviewGroupPanel
    extends CompositeDisposable
    implements IGroupPanel {
    private readonly mutableDisposable = new MutableDisposable();

    readonly api: DockviewPanelApiImpl;
    private _group: GroupviewPanel | undefined;
    private _params?: Parameters;

    readonly onDidStateChange: Event<void>;

    private _view?: IGroupPanelView;

    private _title: string;
    private _suppressClosable: boolean;

    get title() {
        return this._title;
    }

    get suppressClosable() {
        return this._suppressClosable;
    }

    get group(): GroupviewPanel | undefined {
        return this._group;
    }

    get view() {
        return this._view;
    }

    constructor(
        public readonly id: string,
        private readonly containerApi: DockviewApi
    ) {
        super();
        this._suppressClosable = false;
        this._title = '';

        this.api = new DockviewPanelApiImpl(this, this._group);
        this.onDidStateChange = this.api.onDidStateChange;

        this.addDisposables(
            this.api.onActiveChange(() => {
                this.containerApi.setActivePanel(this);
            }),
            this.api.onDidTitleChange((event) => {
                const title = event.title;
                this.update({ params: { title } });
            })
        );
    }

    public init(params: IGroupPanelInitParameters): void {
        this._params = params.params;
        this._view = params.view;

        this._title = params.title;
        this._suppressClosable = params.suppressClosable || false;

        if (params.state) {
            this.api.setState(params.state);
        }

        this.view?.init({
            ...params,
            api: this.api,
            containerApi: this.containerApi,
        });
    }

    focus() {
        this.api._onFocusEvent.fire();
    }

    public setDirty(isDirty: boolean) {
        this.api._onDidDirtyChange.fire(isDirty);
    }

    public close(): Promise<boolean> {
        if (this.api.tryClose) {
            return this.api.tryClose();
        }

        return Promise.resolve(true);
    }

    public toJSON(): GroupviewPanelState {
        const state = this.api.getState();

        const objectState: GroupviewPanelState = {
            id: this.id,
            view: this.view!.toJSON(),
            params:
                Object.keys(this._params || {}).length > 0
                    ? this._params
                    : undefined,
            state: state && Object.keys(state).length > 0 ? state : undefined,
            suppressClosable: this.suppressClosable || undefined,
            title: this.title,
        };

        return objectState;
    }

    public update(event: GroupPanelUpdateEvent): void {
        const params = event.params as IGroupPanelInitParameters;

        const didTitleChange =
            typeof params.title === 'string' &&
            params.title !== this._params?.title;
        const didSuppressChangableClose =
            typeof params.suppressClosable === 'boolean' &&
            params.suppressClosable !== this._params?.suppressClosable;

        this._params = {
            ...(this._params || {}),
            ...event.params.params,
        };

        if (didTitleChange) {
            this.api._titleChanged.fire({ title: params.title });
        }

        if (didSuppressChangableClose) {
            this.api._suppressClosableChanged.fire({
                suppressClosable: !!params.suppressClosable,
            });
        }

        this.view?.update({
            params: {
                params: this._params,
                title: this.title,
                suppressClosable: this.suppressClosable,
            },
        });
    }

    public updateParentGroup(group: GroupviewPanel, isGroupActive: boolean) {
        this._group = group;
        this.api.group = group;

        this.mutableDisposable.value = this._group.group.onDidGroupChange(
            (ev) => {
                if (ev.kind === GroupChangeKind.GROUP_ACTIVE) {
                    const isVisible = !!this._group?.group.isPanelActive(this);
                    this.api._onDidActiveChange.fire({
                        isActive: isGroupActive && isVisible,
                    });
                    this.api._onDidVisibilityChange.fire({
                        isVisible,
                    });
                }
            }
        );

        const isPanelVisible = this._group.group.isPanelActive(this);

        this.api._onDidActiveChange.fire({
            isActive: isGroupActive && isPanelVisible,
        });
        this.api._onDidVisibilityChange.fire({
            isVisible: isPanelVisible,
        });

        this.view?.updateParentGroup(
            this._group,
            this._group.group.isPanelActive(this)
        );
    }

    public layout(width: number, height: number) {
        // the obtain the correct dimensions of the content panel we must deduct the tab height
        this.api._onDidPanelDimensionChange.fire({
            width,
            height: height - (this.group?.group.tabHeight || 0),
        });

        this.view?.layout(width, height);
    }

    public dispose() {
        this.api.dispose();
        this.mutableDisposable.dispose();

        this.view?.dispose();
    }
}