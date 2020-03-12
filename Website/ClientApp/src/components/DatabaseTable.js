import React, { Component, Fragment } from 'react';
import { Button, Icon, Input, Table, Spin } from 'antd';
import moment from 'moment';
import Highlighter from 'react-highlight-words';

import styles from '../CSS/DatabaseTable.module.css';
import FormHandler from './Forms';

export default class DatabaseTable extends Component {
    constructor(props) {
		super(props);

		this.BookTableColumns = [
			{
				title: 'ISBN',
				dataIndex: 'ISBN',
				key: 'ISBN',
				width: 175,
				sorter: (a, b) => a.ISBN - b.ISBN,
				...this.getColumnSearchProps('ISBN'),
			},
			{
				title: 'Year Published',
				dataIndex: 'year_published',
				key: 'year_published',
				width: 200,
				sorter: (a, b) => a.year_published - b.year_published,
				...this.getColumnSearchProps('year_published'),
			},
			{
				title: 'Title',
				dataIndex: 'title',
				key: 'title',
				sorter: (a, b) => { return a.title.localeCompare(b.title) },
				...this.getColumnSearchProps('title'),
			},
			{
				title: 'Author ID',
				dataIndex: 'authorID',
				key: 'authorID',
				width: 250,
				sorter: (a, b) => { return a.authorID.localeCompare(b.authorID) },
				...this.getColumnSearchProps('authorID'),
			},
			{
				title: 'Publisher ID',
				dataIndex: 'publisherID',
				key: 'publisherID',
				width: 250,
				sorter: (a, b) => { return a.publisherID.localeCompare(b.publisherID) },
				...this.getColumnSearchProps('publisherID'),
			},
		];

		this.AuthorTableColumns = [
			{
				title: 'Author ID',
				dataIndex: 'authorID',
				key: 'authorID',
				sorter: (a, b) => a.authorID - b.authorID,
				...this.getColumnSearchProps('authorID'),
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				width: 250,
				sorter: (a, b) => { return a.name.localeCompare(b.name) },
				...this.getColumnSearchProps('name'),
			},
			{
				title: 'Date of Birth',
				dataIndex: 'dob',
				key: 'dob',
				width: 200,
				sorter: (a, b) => moment(a.dob).unix() - moment(b.dob).unix(),
				...this.getColumnSearchProps('dob'),
			},
			{
				title: 'Date of Death',
				dataIndex: 'dod',
				key: 'dod',
				width: 200,
				sorter: (a, b) => moment(a.dod).unix() - moment(b.dod).unix(),
				...this.getColumnSearchProps('dod'),
			},
		];

		this.PublisherTableColumns = [
			{
				title: 'Publisher ID',
				dataIndex: 'publisherID',
				key: 'publisherID',
				width: 125,
				sorter: (a, b) => a.publisherID - b.publisherID,
				...this.getColumnSearchProps('publisherID'),
			},
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				sorter: (a, b) => { return a.name.localeCompare(b.name) },
				...this.getColumnSearchProps('name'),
			},
		];

        this.state = {
            tableData: this.props.dataSource,
			selectedRowKeys: [],
			searchText: '',
			searchedColumn: '',
		};
    };

    componentDidUpdate(prevProps) {
		if (prevProps.dataSource !== this.props.dataSource) {
			if (this.props.columns === "AuthorTableColumns") {
				var tempData = this.props.dataSource;

				for (let i = 0; i < tempData.length; i++) {
					if (tempData[i].dob !== null)
						tempData[i].dob = tempData[i].dob.substr(0, tempData[i].dob.indexOf('T'));
					if (tempData[i].dod !== null)
						tempData[i].dod = tempData[i].dod.substr(0, tempData[i].dod.indexOf('T'));
				}

				this.setState({
					tableData: tempData,
					selectedRowKeys: []
				});
			} else {
				this.setState({
					tableData: this.props.dataSource,
					selectedRowKeys: []
				});
			}
        }
	}

	getColumnSearchProps = dataIndex => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					ref={node => {
						this.searchInput = node;
					}}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
					icon="search"
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					Search
				</Button>
				<Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
					Reset
				</Button>
			</div>
		),
		filterIcon: filtered => (
			<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
		),
		onFilter: (value, record) => {
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase())},
		onFilterDropdownVisibleChange: visible => {
			if (visible) {
				setTimeout(() => this.searchInput.select());
			}
		},
		render: text => {
			console.log(text);
			console.log(this.state.searchedColumn);
			console.log(dataIndex);

			return this.state.searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[this.state.searchText]}
					autoEscape
					textToHighlight={text.toString()}
				/>
			) : (
					text
				);
		},
	});

	handleSearch = (selectedKeys, confirm, dataIndex) => {
		confirm();
		this.setState({
			searchText: selectedKeys[0],
			searchedColumn: dataIndex,
		});
	};

	handleReset = clearFilters => {
		clearFilters();
		this.setState({ searchText: '' });
	};

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    handleDelete = () => {
        this.props.deleteCallback(this.state.selectedRowKeys);
        this.setState({ selectedRowKeys: [] });
    };

    render() {
        var { selectedRowKeys, tableData } = this.state;
        const { formHandlerType, tableLoading, tableWidth, rowKey } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };

        const loading = {
            spinning: tableLoading,
            indicator: <Spin size="large" tip={<div className={styles.LoadingSpinTip}>Fetching from Database</div>} />,
		}
		console.log(tableData);
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
						columns={this[this.props.columns]}
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