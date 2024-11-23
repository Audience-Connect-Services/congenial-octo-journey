/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import CreditCheckForm from "./CreditCheckForm";
import { Table } from "react-bootstrap";
import BocButton from "../../shared/BocButton";
import DashboardHeadline from "../../shared/DashboardHeadline";
import NextPreBtn from "../../shared/NextPreBtn";
import PageLoader from "../../shared/PageLoader";
import "../customers/Customer.css";
import "../remita/Remita.css";
import ViewBySection from "../remita/ViewBySection";
import useSearch from "../../../../../utilities/useSearchName";
import useSearchByDate from "../../../../../utilities/useSearchByDate";
import useSearchByDateRange from "../../../../../utilities/useSearchByDateRange";
import KycViewDetails from "../kyc/KycViewDetails";
import { toast } from "react-toastify";
import { customerApprovalEnum } from "../../../../lib/userRelated";
import { fetchAllCustomersLoans } from "../../../../redux/reducers/customersLoansReducer";
import apiClient from "../../../../lib/axios";

const styles = {
  btnBox: {
    display: "flex",
    justifyContent: "center",
  },
  table: {
    //   margin: "0 2rem 0 3rem",
    fontSize: "14px",
  },
  head: {
    color: "#fff",
  },
  approved: {
    color: "#5cc51c",
  },
  completed: {
    color: "#f64f4f",
  },
  pending: {
    color: "#ecaa00",
  },
  yes: {
    color: "#5cc51c",
    fontWeight: "bold",
  },
};

const CreditBureauDashboard = () => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [searchCustomer, setSearchCustomer] = useState([]);
  const [showCreditCheckForm, setShowCreditCheckForm] = useState(false);
  const [show, setShow] = useState(false);
  const [showError, setShowError] = useState(false);

  const [customerInfo, setCustomerInfo] = useState(null);
  // current login superAdmin user
  const currentUser = useSelector((state) => state.adminAuth.user);

  // fetch all customer
  const dispatch = useDispatch();
  const customers = useSelector(
    (state) => state.customersLoansReducer.customersAndLoans
  );

  const status = useSelector((state) => state.customerReducer.status);

  // get current login admin
  const admin = useSelector((state) => state.adminAuth.user);
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    setAdminName(admin.fullName);
  }, [admin, showCreditCheckForm]);

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchAllCustomersLoans({}));
    };
    getData();
  }, [dispatch]);

  // handle search by
  const { searchTerm, setSearchTerm, filteredData } = useSearch(
    customers,
    "firstname"
  );

  const [dateRange, setDateRange] = useState({
    fromDate: "",
    toDate: "",
  });

  useEffect(() => {
    setSearchCustomer(filteredData);
  }, [searchTerm, filteredData]);

  useEffect(() => {
    setSearchCustomer(customers);
  }, [customers]);

  // handle search by date
  const { filteredDateData } = useSearchByDate(customers, "createdAt");
  const searchByDate = () => {
    setSearchCustomer(filteredDateData);
  };

  // handle list reload
  const handleReload = () => {
    setDateRange({
      fromDate: "",
      toDate: "",
    });
    dispatch(fetchAllCustomersLoans({}));
    setSearchCustomer(customers);
  };

  // handle search by date range
  const { searchData } = useSearchByDateRange(
    customers,
    dateRange,
    "createdAt"
  );

  useEffect(() => {
    setSearchCustomer(searchData);
  }, [searchData]);

  // check if login admin is coo or credit analyst
  // if coo, show all customers
  // if credit analyst, show only customers assigned to him/her
  const [filteredCustomersData, setFilteredCustomersData] = useState([]);

  const filterCustomers = () => {
    if (admin.role === "credit analyst") {
      const filteredCustomers = searchCustomer?.filter((customer) => {
        return (
          customer.creditCheck.assignment.isCreditAnalystAssigned === false ||
          (customer.creditCheck.assignment.creditAnalyst === adminName &&
            customer.kyc.isKycCompleted === true)
        );
      });
      setFilteredCustomersData(filteredCustomers);
    } else {
      const filteredCustomers = searchCustomer?.filter((customer) => {
        return customer.kyc.isKycApproved === true;
      });

      setFilteredCustomersData(filteredCustomers);
    }
  };

  useEffect(() => {
    filterCustomers();
  }, [searchCustomer]);

  // handle credit check start btn
  const handleStartCheck = (customer) => {
    setSelectedCustomer(customer);

    if (!customer.creditCheck.assignment.isCreditAnalystAssigned) {
      setShow(true);
    } else {
      setShowError(true);
    }
  };

  // handle cancel check
  const handleCancelCheck = () => {
    setShowCreditCheckForm(false);
    setSelectedCustomer("");
    dispatch(fetchAllCustomersLoans({}));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [showCreditCheckForm]);

  // handle assignment and start credit check
  const assignCustomer = async () => {
    await apiClient.put(`/updatecustomer/assignto/${selectedCustomer._id}`, {
      creditAnalyst: adminName,
      isCreditAnalystAssigned: true,
    });

    await dispatch(fetchAllCustomersLoans({}));
  };

  const handleProceed = async () => {
    try {
      const res = await assignCustomer(); // assign customer to credit analyst
      console.log(res, "res");

      setShow(false);
      setShowCreditCheckForm(true);
    } catch (error) {
      console.log(error);
      toast.error();
    }
  };

  const checkViewPermissions = (userTypes) => {
    if (userTypes.includes(currentUser.userRole.value)) {
      return true;
    }
    return false;
  };

  const handleClose = () => {
    setShow(false);
    setShowError(false);
  };

  return (
    <>
      {!showCreditCheckForm && !customerInfo ? (
        <div>
          <div>
            {/* view by section */}
            <ViewBySection
              setSearch={setSearchTerm}
              setDateRange={setDateRange}
              dateRange={dateRange}
              searchDateFunc={searchByDate}
              handleReload={handleReload}
            />
          </div>

          {/* table section */}
          {status === "loading" && <PageLoader />}
          <div className="RBox">
            <DashboardHeadline
              fontSize="0.2rem"
              height="52px"
              mspacer="2rem 0 -3.25rem -1rem"
              bgcolor="#145098"
            ></DashboardHeadline>
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th> ID</th>
                    <th>Name</th>
                    <th>Employer</th>
                    <th>Loan Amt</th>
                    <th>Review</th>
                    <th>Assigned</th>
                    <th>Analyst Check</th>
                    {(currentUser.userRole.can.includes(
                      "headOfCreditApproval"
                    ) || currentUser.userRole.can.includes("cooApproval")) && <th>HOC Approval</th>}
                    {currentUser.userRole.can.includes("cooApproval") && (
                      <th>COO Approval</th>
                    )}
                  </tr>
                </thead>

                <tbody>
                  {/* show no record if no customer is available */}
                  {filteredCustomersData.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No record available
                      </td>
                    </tr>
                  )}
                  {filteredCustomersData?.map((customer) => (
                    <tr key={customer._id}>
                      <td>{customer?.customerId}</td>
                      <td>
                        {customer.firstname} {customer.lastname}
                      </td>
                      {customer.employer?.employersName ? (
                        <td>{customer.employer?.employersName}</td>
                      ) : (
                        <td>N/A</td>
                      )}

                      <td>N{customer.loan?.loanamount}</td>
                      <td
                        className="cursor-pointer text-primary underline text-underline"
                        onClick={() => {
                          setCustomerInfo(customer);
                        }}
                      >
                        Full Details
                      </td>
                      {customer.creditCheck.assignment
                        .isCreditAnalystAssigned ? (
                        <td style={styles.yes}>
                          Yes{" "}({customer?.creditCheck.assignment.creditAnalyst})
                        </td>
                      ) : (
                        <td style={styles.completed}>No</td>
                      )}

                      {customer?.creditCheck?.decisionSummary
                        ?.creditOfficerApprovalStatus ===
                      customerApprovalEnum.pending ? (
                        <td>
                          <div>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="80px"
                              margin="0 4px"
                              bgcolor="#FFBF00"
                              func={() => {
                                if (
                                  customer?.creditCheck.assignment
                                    .creditAnalyst === admin.fullName
                                ) {
                                  setSelectedCustomer(customer);
                                  setShowCreditCheckForm(true);
                                } else {
                                  handleStartCheck(customer);
                                }
                              }}
                            >
                              {customer?.creditCheck.assignment.creditAnalyst ==
                              admin.fullName
                                ? "Continue..."
                                : "Assigned"}
                            </BocButton>
                          </div>
                        </td>
                      ) : (
                        <td>
                          <div>
                            <BocButton
                              bradius="12px"
                              fontSize="14px"
                              width="80px"
                              margin="0 4px"
                              bgcolor="#028a0f"
                              func={() => {
                                if (
                                  checkViewPermissions([
                                    "credit_analyst",
                                    "super_admin",
                                  ])
                                ) {
                                  setSelectedCustomer(customer);
                                  setShowCreditCheckForm(true);
                                }
                              }}
                            >
                              {
                                customer?.creditCheck?.decisionSummary
                                  ?.creditOfficerApprovalStatus
                              }
                            </BocButton>
                          </div>
                        </td>
                      )}

                      {(currentUser.userRole.can.includes(
                      "headOfCreditApproval"
                    ) || currentUser.userRole.can.includes("cooApproval")) && (
                        <td>
                          <BocButton
                            bradius="12px"
                            fontSize="14px"
                            width="80px"
                            margin="0 4px"
                            bgcolor={
                              customer?.creditCheck?.decisionSummary
                                ?.headOfCreditApprovalStatus ===
                              customerApprovalEnum.approved
                                ? "#028a0f"
                                : "rgb(251 191 36)"
                            }
                            func={() => {
                              setSelectedCustomer(customer);
                              setShowCreditCheckForm(true);
                            }}
                          >
                            {
                              customer?.creditCheck?.decisionSummary
                                ?.headOfCreditApprovalStatus
                            }
                          </BocButton>
                        </td>
                      )}
                      {currentUser.userRole.can.includes("cooApproval") && (
                        <td>
                          <BocButton
                            bradius="12px"
                            fontSize="14px"
                            width="80px"
                            margin="0 4px"
                            bgcolor={
                              customer?.creditCheck?.decisionSummary
                                ?.cooApprovalStatus ===
                              customerApprovalEnum.approved
                                ? "#028a0f"
                                : "rgb(251 191 36)"
                            }
                            func={() => {
                              setSelectedCustomer(customer);
                              setShowCreditCheckForm(true);
                            }}
                          >
                            {
                              customer?.creditCheck?.decisionSummary
                                ?.cooApprovalStatus
                            }
                          </BocButton>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <NextPreBtn />
          </div>
        </div>
      ) : showCreditCheckForm ? (
        <div>
          {/* credit check form  */}
          <CreditCheckForm
            setShowCreditCheckForm={setShowCreditCheckForm}
            customerId={selectedCustomer?._id}
            initFormStep={
              selectedCustomer?.creditCheck?.decisionSummary
                ?.creditOfficerApprovalStatus === customerApprovalEnum.approved
                ? 3
                : 0
            }
          />
          <div className="  d-flex justify-content-center">
            <button
              className="btn  col-md-4   btn-danger"
              onClick={handleCancelCheck}
            >
              Cancel Check
            </button>
          </div>
        </div>
      ) : (
        customerInfo && (
          <KycViewDetails
            customer={customerInfo}
            setShowInfo={setCustomerInfo}
          />
        )
      )}

      {/* pop up modal */}
      <div>
        <Modal show={show} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title>{"Assign Customer Notification"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This customer will be assigned to you for credit check. Do you want
            to proceed?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleProceed}>
              Assign/Proceed
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* Error pop up modal */}
      <div>
        <Modal show={showError} backdrop="static" keyboard={false}>
          <Modal.Header>
            <Modal.Title> Error in Process</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            This customer has already been assigned to another staff
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default CreditBureauDashboard;
