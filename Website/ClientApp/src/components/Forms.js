import React, { Component, Fragment } from 'react';
import { Button, Icon } from 'antd';
import moment from 'moment';

import { AddBookForm } from './Book';
import { AddAuthorForm } from './Author';
import { AddPublisherForm } from './Publisher';

import styles from '../CSS/Forms.module.css';

export default class FormHandler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            editing: false,
            formData: this.props.formData,
            selectedRowKeys: this.props.selectedRowKeys,
        };
    };

    componentDidUpdate(prevProps) {
        if ((prevProps.formData !== this.props.formData) || (prevProps.selectedRowKeys !== this.props.selectedRowKeys)) {
            this.setState({
                formData: this.props.formData,
                selectedRowKeys: this.props.selectedRowKeys
            });
        }
    }

    showModal = () => {
        this.setState({
            visible: true,
            editing: false,
        });
    };

    showEditModal = () => {
        this.setState({
            visible: true,
            editing: true,
        });
    };

    handleCancel = () => {
        this.setState({ visible: false });
    };

    /* Validate the form, checking for required fields. */
    handleCreate = () => {
        const { form } = this.formRef.props;

        form.validateFields((err, values) => {
            if (err) {
                return;
			}

			console.log("Received values of form: ", values);

			/* Need to remove everything from year_published that isn't the year. */
			if (typeof values.year_published !== 'undefined')
				values.year_published = moment(values.year_published).format('YYYY');

            if (this.state.editing)
                this.props.formCallback(values, this.state.selectedRowKeys[0]);
            else
                this.props.formCallback(values, -1);

            form.resetFields();
            this.setState({ visible: false });
        });
    };

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    render() {
        var { visible, editing, formData, selectedRowKeys } = this.state;
        var { formType } = this.props;

        var FormName = null;
        switch (formType) {
            case 'Book':
                FormName = AddBookForm;
                break;
            case 'Author':
                FormName = AddAuthorForm;
                break;
            case 'Publisher':
                FormName = AddPublisherForm;
				break;
			default:
				break;
        }

        return (
            <Fragment>
                <Button type="primary" onClick={this.showModal} className={styles.TableHeader}>
                    <Icon type="plus" className={styles.ButtonIcon} />
                    Add {formType}
                </Button>
                {selectedRowKeys.length === 1 ?
                    <Button type="default" onClick={this.showEditModal} style={{ marginRight: 10 }}>
                        <Icon type="edit" style={{ position: 'relative', bottom: 3 }} />
                        Edit
					</Button>
                    : null
                }

                <FormName
                    wrappedComponentRef={this.saveFormRef}
                    visible={visible}
                    onCancel={this.handleCancel}
                    onCreate={this.handleCreate}
                    defaultData={formData}
                    selectedRowKeys={selectedRowKeys}
                    editing={editing}
                />
            </Fragment>
        );
    }
}