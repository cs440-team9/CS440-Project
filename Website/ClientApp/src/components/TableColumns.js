import moment from 'moment';

const BookTableColumns = [
    {
        title: 'ISBN',
        dataIndex: 'ISBN',
        width: 200,
        sorter: (a, b) => a.ISBN - b.ISBN,
    },
    {
        title: 'Date Published',
        dataIndex: 'date_published',
        width: 200,
		sorter: (a, b) => moment(a.dob).unix() - moment(b.dob).unix(),
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
        sorter: (a, b) => a.authorID - b.authorID,
    },
    {
        title: 'Publisher ID',
        dataIndex: 'publisherID',
        width: 250,
        sorter: (a, b) => a.authorID - b.authorID,
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
        width: 100,
        sorter: (a, b) => { return a.name.localeCompare(b.name) },
    },
    {
        title: 'Date of Birth',
        dataIndex: 'dob',
        width: 100,
        sorter: (a, b) => moment(a.dob).unix() - moment(b.dob).unix(),
    },
    {
        title: 'Date of Death',
        dataIndex: 'dod',
        width: 100,
        sorter: (a, b) => moment(a.dod).unix() - moment(b.dod).unix(),
    },
];

const PublisherTableColumns = [
    {
        title: 'Publisher ID',
        dataIndex: 'publisherID',
        sorter: (a, b) => a.publisherID - b.publisherID,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        width: 100,
        sorter: (a, b) => { return a.name.localeCompare(b.name) },
    },
];

export {
    BookTableColumns,
    AuthorTableColumns,
    PublisherTableColumns
};