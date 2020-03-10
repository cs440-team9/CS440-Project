import React, { Component } from 'react';
import moment from 'moment';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const BookTableColumns = [
    {
        title: 'ISBN',
        dataIndex: 'ISBN',
        width: 200,
		sorter: (a, b) => a.ISBN - b.ISBN,
		render: text => <a href={"https://isbnsearch.org/isbn/" + text}>{text}</a>,
    },
    {
        title: 'Date Published',
        dataIndex: 'date_published',
        width: 200,
		sorter: (a, b) => moment(a.date_published).unix() - moment(b.date_published).unix(),
		render: text => moment(text).format('LL'),
    },
    {
        title: 'Title',
        dataIndex: 'title',
        sorter: (a, b) => { return a.title.localeCompare(b.title) },
    },
    {
        title: 'Genre',
        dataIndex: 'genre',
        width: 200,
        sorter: (a, b) => { return a.genre.localeCompare(b.genre) },
    },
    {
        title: 'Author ID',
        dataIndex: 'authorID',
        width: 250,
		sorter: (a, b) => { return a.authorID.localeCompare(b.authorID) },
		render: (text, record) => <Link to={'author/'} onClick={() => { window.location.href = '/author'; }}>{text}</Link>,
    },
    {
        title: 'Publisher ID',
        dataIndex: 'publisherID',
		width: 250,
		sorter: (a, b) => { return a.publisherID.localeCompare(b.publisherID) },
		render: (text, record) => <Link to={'publisher/'} onClick={() => { window.location.href = '/publisher'; }}>{text}</Link>,
    },
];

const AuthorTableColumns = [
    {
        title: 'Author ID',
        dataIndex: 'authorID',
        sorter: (a, b) => a.authorID - b.authorID,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 250,
        sorter: (a, b) => { return a.name.localeCompare(b.name) },
    },
    {
        title: 'Date of Birth',
        dataIndex: 'dob',
        width: 200,
		sorter: (a, b) => moment(a.dob).unix() - moment(b.dob).unix(),
		render: text => moment(text).format('LL'),
    },
    {
        title: 'Date of Death',
        dataIndex: 'dod',
        width: 200,
		sorter: (a, b) => moment(a.dod).unix() - moment(b.dod).unix(),
		render: text => moment(text).format('LL'),
    },
];

const PublisherTableColumns = [
    {
        title: 'Publisher ID',
		dataIndex: 'publisherID',
		width: 125,
        sorter: (a, b) => a.publisherID - b.publisherID,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => { return a.name.localeCompare(b.name) },
    },
];

export {
    BookTableColumns,
    AuthorTableColumns,
    PublisherTableColumns
};