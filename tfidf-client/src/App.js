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
        this.state = this.getDefaultState();
    }

    handleInput(evt, idx) {
        const newSrc = [].concat(this.state.src);
        newSrc[idx].src = evt.target.value;
        this.setState({
            src: newSrc
        });
    }

    addUrl() {
        const newSrc = this.state.src.concat({
            type: 'url',
            src: ''
        });
        this.setState({
            src: newSrc
        });
    }

    addText() {
        const newSrc = this.state.src.concat({
            type: 'text',
            src: ''
        });
        this.setState({
            src: newSrc
        });
    }

    startTfidf() {
        this.setState({
            isLoading: true,
            tfidf: []
        });
        tfidf(this.state.src.filter((src) => !!src.src))
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
            src: [],
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
                    <button className="button-primary" onClick={this.startTfidf.bind(this)} disabled={!this.isValid()}>
                        Начать Tf-Idf
                        <i className="btn-icon icon-play"></i>
                    </button>
                </div>
                {
                    !this.state.tfidf ? (
                        <div className="container">
                            <label>Добавьте источники для анализа</label>
                            {this.state.src.map((src, idx) => {
                                if (src.type === 'url') {
                                    return (
                                        <div key={idx} className="link-input">
                                            <input className="u-full-width" type="text" placeholder="http//meduza.io/article"
                                                value={this.state.src[idx].src}
                                                onChange={(evt) => this.handleInput(evt, idx)} />
                                            {isUrl(this.state.src[idx].src) ? <i className="icon-check"></i> : <i className="icon-block"></i>}
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div key={idx} className="link-input">
                                            <textarea className="u-full-width" type="text" placeholder="Введите текст"
                                                value={this.state.src[idx].src}
                                                onChange={(evt) => this.handleInput(evt, idx)} />
                                        </div>
                                    );
                                }
                            })}
                            <div className="center-button-container">
                                <button onClick={this.addUrl.bind(this)}>
                                    Добавить Ссылку
                                    <i className="btn-icon icon-link"></i>
                                </button>
                                <button onClick={this.addText.bind(this)}>
                                    Добавить Текст
                                    <i className="btn-icon icon-newspaper"></i>
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
                                                    <li hidden={!res.url}>
                                                        <strong>Источник:</strong> <a href={res.url} target="_blank">{res.url}</a>
                                                    </li>
                                                    <li hidden={!res.title}>
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

    getDefaultState() {
        return {
            src: [{
                type: 'text',
                src: `Впервые после объединения шахматного мира в 2006 году в титульном матче встретятся два молодых гроссмейстера, представители нового поколения игроков. Карякин и Карлсен ровесники: оба родились в 1990 году, оба — вундеркинды современных шахмат, побившие не один рекорд. Карякин стал самым молодым гроссмейстером в мире в возрасте 12 лет и 211 дней, а Карлсен впервые возглавил мировой рейтинг ФИДЕ в 19 лет и не покидает первую строчку с июля 2011 года. И хотя оба шахматиста двигались к вершине одновременно и часто играли друг с другом на крупных турнирах, нельзя сказать, что они пришли к чемпионскому матчу похожими путями. Магнус Карлсен — суперзвезда, причем не только в шахматах. Успехи за доской он совмещает со съемками в рекламе, спонсорскими контрактами и собственным бизнесом. Так, компания Карлсена выпустила шахматное приложение Play Magnus, которое установили более 600 тысяч раз. Норвежец регулярно появляется на телевидении и чуть было не снялся в кино, когда в 2012 году Джей Джей Абрамс предложил ему эпизодическую роль в фильме «Стартрек: Возмездие». В 2013 году журнал Time включил Карлсена в список 100 самых влиятельных людей планеты, а осенью 2016 года вышел документальный фильм «Магнус», посвященный карьере шахматиста. Карлсен считается сильнейшим шахматистом современности. Он стал чемпионом мира в 2013 году, выиграв у Вишванатана Ананда, и защитил титул в матче против него год спустя. В 2014 Карлсен собрал шахматный «большой шлем», выиграв чемпионаты мира по быстрым шахматам и блицу. Одно из сильнейших качеств Карлсена — умение провоцировать соперника на ошибки. «Он понимает, что большинство игроков под давлением будут просчитываться даже в несложных позициях, поэтому никогда не ослабляет хватку. Понемногу просчеты копятся, и Карлсен превращает их в победу как будто по волшебству», — считает Паримарьян Неги, второй в списке самых молодых гроссмейстеров мира. Карлсен также отличается выдающимся видением позиции: там, где большинство игроков согласились бы на ничью, он всегда ищет путь к победе. И часто его находит. По мнению Неги, именно благодаря этому Карлсен — грозный соперник для лучших шахматистов, и противостоять его давлению могут единицы, в том числе Сергей Карякин.`
            },
            {
                type: 'url',
                src: 'https://meduza.io/feature/2016/11/11/demonstratsii-pererosli-v-besporyadki'
            }],
            tfidf: null,
            isLoading: false
        };
    }

    isValid() {
        if (this.state.src.length === 0) {return false;}
        const isValid = this.state.src.every((src) => {
            if (src.type === 'url') {
                return isUrl(src.src);
            } else {
                return !!src.src;
            }
        });
        return isValid;
    }
}

export default App;
