import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button, Icon, Table, Spin } from 'antd';
import moment from 'moment';

import styles from '../CSS/DatabaseTable.module.css';
import FormHandler from './Forms';

export default class DatabaseTable extends Component {
    constructor(props) {
        super(props);

		var columns = null;
		switch (this.props.columns) {
			case "BookTableColumns":
				columns = BookTableColumns;
				break;
			case "AuthorTableColumns":
				columns = AuthorTableColumns;
				break;
			case "PublisherTableColumns":
				columns = PublisherTableColumns;
				break;
		}

        this.state = {
            tableData: this.props.dataSource,
			selectedRowKeys: [],
			selectedColumns: columns,
        };
    };

    componentDidUpdate(prevProps) {
        if (prevProps.dataSource !== this.props.dataSource) {
            this.setState({
                tableData: this.props.dataSource,
                selectedRowKeys: []
            });
        }
    }

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    handleDelete = () => {
        this.props.deleteCallback(this.state.selectedRowKeys);
        this.setState({ selectedRowKeys: [] });
    };

    render() {
        var { selectedRowKeys, tableData, selectedColumns } = this.state;
        const { columns, formHandlerType, tableLoading, tableWidth, rowKey } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const loading = {
            spinning: tableLoading,
            indicator: <Spin size="large" tip={<div className={styles.LoadingSpinTip}>Fetching from Database</div>} />,
        }

        return (
            <Fragment>
                <div style={{ maxWidth: tableWidth }}>
                    <FormHandler
                        formType={formHandlerType}
                        formCallback={this.props.formHandlerCallback}
                        selectedRowKeys={selectedRowKeys}
                        formData={tableData}
                    />

                    <div className={styles.TableHeader}>
                        {selectedRowKeys.length > 0 ?
                            <div>
                                <Button type="danger" onClick={this.handleDelete} style={{ marginRight: 10 }}>
                                    <Icon type="delete" style={{ position: 'relative', bottom: 3 }} />
                                </Button>
                                Selected {selectedRowKeys.length} items
							</div>
                            : null
                        }
                    </div>

                    <Table
                        locale={{ emptyText: <div style={{ height: 120 }} /> }}
                        loading={loading}
                        rowKey={rowKey}
                        rowSelection={rowSelection}
                        columns={selectedColumns}
                        dataSource={tableData}
                        width={tableWidth}
                        scroll={{ x: tableWidth - 100, y: 750 }}
                        pagination={{ position: 'bottom', pageSize: 8 }}
                    />
                </div>
            </Fragment>
        );
    }
}

const BookTableColumns = [
	{
		title: 'ISBN',
		dataIndex: 'ISBN',
		width: 175,
		sorter: (a, b) => a.ISBN - b.ISBN,
		render: text => <a href={"https://isbnsearch.org/isbn/" + text} target="_blank">{text}</a>,
	},
	{
		title: 'Year Published',
		dataIndex: 'year_published',
		width: 200,
		sorter: (a, b) => moment(a.year_published).unix() - moment(b.year_published).unix(),
		render: text => {
			if (text === null)
				return '';
			else
				return moment(text).format('YYYY');
		},
	},
	{
		title: 'Title',
		dataIndex: 'title',
		sorter: (a, b) => { return a.title.localeCompare(b.title) },
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
		render: text => {
			if (text === null)
				return '';
			else
				return moment(text).format('LL');
		},
	},
	{
		title: 'Date of Death',
		dataIndex: 'dod',
		width: 200,
		sorter: (a, b) => moment(a.dod).unix() - moment(b.dod).unix(),
		render: text => {
			if (text === null)
				return '';
			else
				return moment(text).format('LL');
		},
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