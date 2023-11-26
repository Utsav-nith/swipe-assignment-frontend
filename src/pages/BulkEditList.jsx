import React, { useState } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { useInvoiceListData } from "../redux/hooks";
import Form from "react-bootstrap/Form";
import { BiTrash, BiArrowBack } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { updateBulkInvoice } from "../redux/invoicesSlice";
import { useNavigate, Link } from "react-router-dom";
import generateRandomId from "../utils/generateRandomId";

const BulkEditList = () => {
    const invoiceData = useInvoiceListData();
    const invoice_list = invoiceData.invoiceList;
    const listSize = invoiceData.listSize;
    const [invoiceBulkList, setInvoiceList] = useState(invoice_list ? invoice_list : []);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const formData = {
      id: generateRandomId(),
            currentDate: new Date().toLocaleDateString(),
            invoiceNumber: listSize + 1,
            dateOfIssue: "",
            billTo: "",
            billToEmail: "",
            billToAddress: "",
            billFrom: "",
            billFromEmail: "",
            billFromAddress: "",
            notes: "",
            total: "0.00",
            subTotal: "0.00",
            taxRate: "",
            taxAmount: "0.00",
            discountRate: "",
            discountAmount: "0.00",
            currency: "$",
      items: [
        {
          itemId: 0,
          itemName: "",
          itemDescription: "",
          itemPrice: "1.00",
          itemQuantity: 1,
        },
      ],
    };
      const onItemizedItemEdit = (id, itemId, name, value) => {
        const updatedList = invoiceBulkList.map((invoice) => {
          if (invoice.id === id) {
            const updatedItems = invoice.items.map((item) =>
              item.itemId === itemId ? { ...item, [name]: value } : item
            );
            return { ...invoice, items: updatedItems };
          }
          return invoice;
        });
      
        setInvoiceList(updatedList);
        handleCalculateTotal();
      };
      const handleAdd = (id) => {
        const newItem = {
          itemId: (+new Date() + Math.floor(Math.random() * 999999)).toString(36),
          itemName: "",
          itemDescription: "",
          itemPrice: "1.00",
          itemQuantity: 1,
        };
      
        const updatedList = invoiceBulkList.map((invoice) =>
          invoice.id === id ? { ...invoice, items: [...invoice.items, newItem] } : invoice
        );
      
        setInvoiceList(updatedList);
        handleCalculateTotal();
      };
    const handleCalculateTotal = () => {
      setInvoiceList((prevFormData) => {
        const updatedInvoices = prevFormData.map((invoice) => {
          console.log(invoice);
          let subTotal = 0;
  
          invoice.items.forEach((item) => {
            subTotal += parseFloat(item.itemPrice) * parseInt(item.itemQuantity);
          });
  
          const taxAmount = parseFloat(subTotal * (invoice.taxRate / 100)).toFixed(2);
          const discountAmount = parseFloat(subTotal * (invoice.discountRate / 100)).toFixed(2);
          const total = (subTotal - parseFloat(discountAmount) + parseFloat(taxAmount)).toFixed(2);
  
          return {
            ...invoice,
            subTotal: subTotal.toFixed(2),
            taxAmount,
            discountAmount,
            total,
          };
        });
  
        return updatedInvoices;
      });
    };
    const handleSave = () => {
      dispatch(updateBulkInvoice(invoiceBulkList));
      alert("Invoices updated successfully");
      navigate("/");
    };
    const handleDeleteInvoice = (id) => {
      setInvoiceList((prevInvoiceList) => 
      prevInvoiceList.filter((invoice) => invoice.id !== id)
      );
    };
    const bulkEditField = (id, name, value) => {
        const updatedList = invoiceBulkList.map((item) => {
          if (item.id === id) {
            return { ...item, [name]: value };
          }
          return item;
        });
      
        setInvoiceList(updatedList);
        handleCalculateTotal();
      };
    return (
      <>
        <div className="d-flex align-items-center">
          <BiArrowBack size={18} />
          <div className="fw-bold mt-1 mx-2 cursor-pointer">
            <Link to="/">
              <h5>Go Back</h5>
            </Link>
          </div>
        </div>
        <Row>
          <Col className="mx-auto" xs={12} md={8} lg={12}>
            <Card className="d-flex p-3 p-md-4 my-3 my-md-4 " style={{ minWidth: "100vw", width: "100%" }}>
              <div className="d-flex flex-column">
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                  <div className="d-bloc mb-2">
                    <Button variant="dark" onClick={handleSave}>
                      Update Invoices
                    </Button>
                  </div>
                </div>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Bill From</th>
                      <th>Bill From Address</th>
                      <th>Bill From Email</th>
                      <th>Bill To</th>
                      <th>Bill To Address</th>
                      <th>Bill To Email</th>
                      <th>Currency</th>
                      <th>Current Date</th>
                      <th>Date of Issue</th>
                      <th>Discount Amount</th>
                      <th>Discount Rate</th>
                      <th>Notes</th>
                      <th>Sub Total</th>
                      <th>Tax Amount</th>
                      <th>Tax Rate</th>
                      <th>Total</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceBulkList?.map((invoice, key) => (
                      <> 
                        <tr>
                          <td className="d-flex align-items-center flex-column">
                            <Button style={{ height: "33px", width: "33px", padding: "7.5px" }} onClick={() => handleAdd(invoice.id)}>
                              {invoice.id}
                            </Button>
                            <BiTrash onClick={() => handleDeleteInvoice(invoice.id)} style={{ height: "33px", width: "33px", padding: "7.5px" }} className="text-white  btn mt-1 btn-danger " />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.billFrom}
                              type="text"
                              name="billFrom"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.billFromAddress}
                              type="text"
                              name="billFromAddress"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.billFromEmail}
                              type="email"
                              name="billFromEmail"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.billTo}
                              type="text"
                              name="billTo"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.billToAddress}
                              type="text"
                              name="billToAddress"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.billToEmail}
                              type="email"
                              name="billToEmail"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                          <Form.Select
                  onChange={(event) =>
                    bulkEditField({ currency: event.target.value })
                  }
                  className="btn btn-light my-1"
                  aria-label="Change Currency"
                >
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Singapore Dollar)</option>
                  <option value="¥">CNY (Chinese Renminbi)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.currentDate}
                              type="date"
                              name="currentDate"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.dateOfIssue}
                              type="date"
                              name="dateOfIssue"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <p className="my-3">{invoice.discountAmount}</p>
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.discountRate}
                              type="number"
                              name="discountRate"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.notes}
                              as="textarea"
                              name="notes"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <p className="my-3">{invoice.subTotal}</p>
                          </td>
  
                          <td>
                            <p className="my-3">{invoice.taxAmount}</p>
                          </td>
                          <td>
                            <Form.Control
                              rows={3}
                              value={invoice.taxRate}
                              type="text"
                              name="taxRate"
                              placeholder="0.0"
                              min="0.00"
                              step="0.01"
                              max="100.00"
                              className="my-2"
                              onChange={(e) => bulkEditField(invoice.id, e.target.name, e.target.value)}
                              autoComplete="name"
                              required
                            />
                          </td>
                          <td>
                            <p className="my-3">{invoice.total}</p>
                          </td>
  
                          {invoice.items.map((item, index) => (
                            <tr key={index}>
                              <td>
                                <Form.Control
                                  rows={3}
                                  value={item.itemName}
                                  type="text"
                                  name="itemName"
                                  className="my-2"
                                  onChange={(e) => onItemizedItemEdit(invoice.id, item.itemId, e.target.name, e.target.value)}
                                  autoComplete="name"
                                  required
                                />
                              </td>
                              <td>
                                
                                <Form.Control
                                  rows={3}
                                  value={item.itemDescription}
                                  type="text"
                                  name="itemDescription"
                                  className="my-2"
                                  onChange={(e) => onItemizedItemEdit(invoice.id, item.itemId, e.target.name, e.target.value)}
                                  autoComplete="name"
                                  required
                                />
                              </td>
                              <td>
                                <Form.Control
                                  rows={3}
                                  value={item.itemPrice}
                                  type="number"
                                  name="itemPrice"
                                  min={1}
                                  step={"0.01"}
                                  precision={2}
                                  className="my-2"
                                  onChange={(e) => onItemizedItemEdit(invoice.id, item.itemId, e.target.name, e.target.value)}
                                  autoComplete="name"
                                  required
                                />
                              </td>
                              <td>
                                <div className="d-flex flex-row align-items-center">
                                  <Form.Control
                                    rows={3}
                                    value={item.itemQuantity}
                                    type="number"
                                    name="itemQuantity"
                                    min={1}
                                    step={1}
                                    className="my-2"
                                    onChange={(e) => onItemizedItemEdit(invoice.id, item.itemId, e.target.name, e.target.value)}
                                    autoComplete="name"
                                    required
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Col>
        </Row>
      </>
    );
}

export default BulkEditList;
