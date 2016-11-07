import React, { Component } from 'react';
import { tfidf } from './api';
import renderHTML from 'react-render-html';
import Collapsible from 'react-collapsible';
import Spinner from './Spinner/Spinner';
import ListTerms from './Components/ListTerms';
import swal from 'sweetalert';
import isUrl from 'is-url';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            urls: ['https://meduza.io/news/2016/10/31/kirienko-vozglavit-nablyudatelnyy-sovet-rosatoma', 'https://meduza.io/news/2016/10/31/vladimir-medinskiy-izvinilsya-pered-konstantinom-raykinym'],
            tfidf: null,
            isLoading: false
        };
    }

    handleInput(evt, idx) {
        const newUrls = [].concat(this.state.urls);
        newUrls[idx] = evt.target.value;
        this.setState({
            urls: newUrls
        });
    }

    addUrl() {
        const newUrls = this.state.urls.concat(['']);
        this.setState({
            urls: newUrls
        });
    }

    startTfidf() {
        this.setState({
            isLoading: true,
            tfidf: []
        });
        tfidf(this.state.urls.filter((url) => !!url))
            .then((tfidfRes) => {
                this.setState({
                    tfidf: tfidfRes,
                    isLoading: false
                });
            })
            .catch((err) => {
                this.showErrorMessage();
                this.reset();
            });
    }

    reset() {
        this.setState({
            urls: [''],
            tfidf: null,
            isLoading: false
        });
    }


    render() {
        return (
            <div>
                <header className="header">
                    <h4>
                        TF-IDF
                    </h4>
                </header>
                <div className="container rigth-button-container">
                    <button className="btn-m" onClick={this.reset.bind(this)}>
                        Сбросить
                        <i className="btn-icon icon-arrows-ccw"></i>
                    </button>
                    <button className="button-primary" onClick={this.startTfidf.bind(this)} disabled={!this.state.urls.every(isUrl)}>
                        Начать Tf-Idf
                        <i className="btn-icon icon-play"></i>
                    </button>
                </div>
                {
                    !this.state.tfidf ? (
                        <div className="container">
                            <label>Добавьте ссылки на статьи</label>
                            {this.state.urls.map((url, idx) => {
                                const isValid = isUrl(this.state.urls[idx]);
                                return (
                                    <div key={idx} className="link-input">
                                        <input className="u-full-width" type="text" placeholder="http//enter.article/url"
                                            value={this.state.urls[idx]}
                                            onChange={(evt) => this.handleInput(evt, idx)} />
                                         { isUrl(this.state.urls[idx]) ? <i className="icon-check"></i> : <i className="icon-block"></i>}
                                    </div>);
                            })}
                            <div className="center-button-container">
                                <button onClick={this.addUrl.bind(this)}>
                                    Добавить Ссылку
                                    <i className="btn-icon icon-plus-circled"></i>
                                </button>
                            </div>
                        </div>
                    ) :
                        (
                            <div className="container">
                                {this.state.tfidf.map((res, idx) => {
                                    return (
                                        <Collapsible key={idx} trigger={res.title} transitionTime={200} easing={'ease-out'}>
                                            <h5>Инфо</h5>
                                            <div className="content__meta">
                                                <ul>
                                                    <li>
                                                        <strong>Источник:</strong> <a href={res.url} target="_blank">{res.url}</a>
                                                    </li>
                                                    <li>
                                                        <strong>Заголовок:</strong> {res.title}
                                                    </li>
                                                </ul>
                                            </div>
                                            <h5>Top-10 Слов</h5>
                                            <ListTerms listTerms={res.listTerms} />
                                            <h5>Статья</h5>
                                            {renderHTML(res.tfidfContent)}
                                        </Collapsible>
                                    );
                                })}
                            </div>
                        )
                }
                <Spinner loading={this.state.isLoading} />
            </div>
        );
    }

    showErrorMessage(msg) {
        swal({
            title: "Ошибка!",
            text: msg || "Что-то пошло не так.",
            type: "error",
            confirmButtonText: "Понятно.."
        });
    }
}

export default App;
