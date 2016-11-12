import React, { Component } from 'react';

const TermsTable = ({terms, startIndex}) => {

    return (
        <table className="u-full-width">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Слово</th>
                    <th>TF-IDF</th>
                </tr>
            </thead>
            <tbody>
                {
                    terms
                        .map((term, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{1 + startIndex + idx}</td>
                                    <td>{term.term}</td>
                                    <td>{term.tfidf.toFixed(2)}</td>
                                </tr>
                            );
                        })
                }
            </tbody>
        </table>
    );
};


class ListTerms extends Component {
    render() {
        return (
            <div className="row">
                <div>
                    <TermsTable terms={this.props.listTerms.slice(0, 10)} startIndex={0}/>
                </div>
            </div>
        );
    }
}

export default ListTerms;
