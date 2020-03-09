import React, { Component, Fragment } from 'react';
import { Button, Icon, Table, Spin } from 'antd';

import styles from '../CSS/DatabaseTable.module.css';
import FormHandler from './Forms';

export default class DatabaseTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tableData: this.props.dataSource,
            selectedRowKeys: []
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
        var { selectedRowKeys, tableData } = this.state;
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
                        columns={columns}
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