import * as React from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeviceCodeProps {

}

export interface DeviceCodeState {
    model: boolean;
    form: {
        user_code: string;
        errors: string[]
    };
    userCode: {
        info: string;
        scopes: string;
        user_code: string;
        error?: { message: string; };
    };
    tokens?: Token[];
}

export interface Token {
    id: string;
    user_code: string;
    name: string;
    scopes: string[];
}

class DeviceCode extends React.Component<DeviceCodeProps, DeviceCodeState> {

    constructor(props: DeviceCodeProps){
        super(props);

        this.state = {
            model: false,
            form: {
                user_code: '',
                errors: []
            },
            userCode: {
                info: '',
                scopes: '',
                user_code: '',
            }
        };
    }

    componentDidMount = (): void => {
        this.getTokens();
    }

    getTokens = (): void => {
        fetch('/oauth/device-tokens', {
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        })
            .then((response) => {
                return response.json();
            }).then((json) => {
                this.setState({
                    tokens: json.data
                });
            });
    }

    activateToken = (): void => {
        fetch('/oauth/device-tokens', {
            method: 'POST',
            body: new URLSearchParams({
                'user_code': this.state.form.user_code
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        }).then((response) => {
            return response.json();
        }).catch(() => {
            this.setState((p) => {
                p.form.errors = ['Something went wrong. Please try again.'];
                return p;
            });
        }).then((json) => {
            const tokens = this.state.tokens || [];
            tokens.push(json);

            this.setState({
                userCode: {
                    info: '',
                    scopes: '',
                    user_code: '',
                },
                form: {
                    errors: [],
                    user_code: ''
                }
            });
        });
    }

    revokeToken = (token: Token): void => {
        fetch('/oauth/device-tokens/' + token.id, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            }
        }).then(() => {
            this.getTokens();
        });
    }

    submit = (e: React.FormEvent): void => {
        e.preventDefault();
        this.activateToken();
    }

    renderFeedback = (): JSX.Element => {
        const { form, userCode } = this.state;

        if (!form.user_code || form.user_code.length < 8) {
            return (
                <div className="feedback">
                    Your device must display 8 digits code enter it here.
                </div>
            );
        } else if (form.user_code && userCode.error) {
            return (
                <div className="invalid-feedback">
                    { userCode.error.message }
                </div>
            );
        } else if (form.user_code === userCode.user_code) {
            return (
                <div className="valid-feedback">
                    Device: { userCode.info }
                    { userCode.scopes &&
                        <span>
                            <br />
                            Scopes: { userCode.scopes }
                        </span>
                    }
                </div>
            );
        }

        return (
            <div className="spinner-border spinner-border-sm text-light mt-3" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        );
    }

    renderModel = (): JSX.Element => {
        const { form, model } = this.state;

        const close = (event: React.MouseEvent<HTMLDivElement>): void => {
            if (event.target === document.getElementById('modal-activate-device')) {
                this.setState({ model: false });
            }
        };

        return (
            <>
                <div className={ `modal fade ${model ? 'show d-block' : ''}` } id="modal-activate-device" tabIndex={ -1 } role="dialog" onClick={ close }>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    Activate New Device
                                </h4>
                                <button type="button" className="close" onClick={ () => this.setState({model: false}) } aria-hidden="true">&times;</button>
                            </div>
                            <div className="modal-body">
                                { form.errors.length > 0 &&
                                    <div className="alert alert-danger">
                                        <p className="mb-0"><strong>Whoops!</strong> Something went wrong!</p>
                                        <br />
                                        <ul>
                                            { form.errors.map((error, i) => (
                                                <li key={ i }>
                                                    { error }
                                                </li>
                                            )) }
                                        </ul>
                                    </div>
                                }
                                <form role="form" onSubmit={ this.submit }>
                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label" htmlFor="user_code">User Code</label>
                                        <div className="col-md-9">
                                            <input
                                                id="activate-device-user_code"
                                                type="text" className="form-control"
                                                name="user_code"
                                                value={ form.user_code }
                                                onChange={ (event) => this.setState((p) => {
                                                    p.form.user_code = event.target.value;
                                                    return p;
                                                }) }
                                            />
                                            { this.renderFeedback() }
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={ () => this.setState({ model: false }) }>Close</button>
                                <button type="submit" className="btn btn-primary" onClick={ this.activateToken } disabled={ form.user_code.length < 8 }>
                                    Activate
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                { model && <div className="modal-backdrop fade show" /> }
            </>
        );
    }

    renderTokens = (): JSX.Element => {
        const { tokens } = this.state;

        if (tokens === undefined) {
            return (
                <p className="mb-0">
                    Loading...
                </p>
            );
        }

        if (tokens.length > 0) {
            return (
                <table className="table table-borderless mb-0">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Scopes</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        { tokens.map((token, i) => (
                            <tr key={ i }>
                                <td style={{ verticalAlign: 'middle' }}>
                                    { token.user_code || token.name }
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    { token.scopes.length > 0 &&
                                        <span>
                                            { token.scopes.join(', ') }
                                        </span>
                                    }
                                </td>
                                <td style={{ verticalAlign: 'middle' }}>
                                    <span>
                                        { token.name ? 'pending' : 'connected' }
                                    </span>
                                </td>
                                <td style={{ verticalAlign: 'middle', textAlign: 'right' }}>
                                    <a className="action-link text-danger" onClick={ () => this.revokeToken(token) }>
                                        Delete
                                    </a>
                                </td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            );
        }

        return (
            <p className="mb-0">
                You have not activated any OAuth devices.
            </p>
        );
    }

    render = (): JSX.Element => {
        const { model } = this.state;

        return (
            <div className={ model ? 'model-open' :'' }>
                <div className="card card-default">
                    <div className="card-header">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Devices Access</span>
                            <a className="action-link" tabIndex={ -1 } onClick={ () => this.setState({ model: true }) }>
                                Activate New Device
                            </a>
                        </div>
                    </div>
                    <div className="card-body">
                        { this.renderTokens() }
                    </div>
                </div>
                { this.renderModel() }
            </div>
        );
    }
}

export default DeviceCode;
