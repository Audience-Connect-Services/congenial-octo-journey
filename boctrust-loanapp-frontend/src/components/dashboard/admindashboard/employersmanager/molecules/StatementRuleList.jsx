import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import DashboardHeadline from "../../../shared/DashboardHeadline";
import "../../customers/Customer.css";
import NextPreBtn from "../../../shared/NextPreBtn";
import PageLoader from "../../../shared/PageLoader";
import NoResult from "../../../../shared/NoResult";
import sortByCreatedAt from "../../../shared/sortedByDate";
import TableOptionsDropdown from "../../../shared/tableOptionsDropdown/TableOptionsDropdown";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FcCancel } from "react-icons/fc";
import { toast } from "react-toastify";
import { fetchStatementRules } from "../../../../../redux/reducers/statementRuleReducer";
import EditStatementRule from "./editRule/EditStatementRule";

const StatementRuleList = () => {
  const styles = {
    head: {
      color: "#fff",
      fontSize: "0.9rem",
    },
    approved: {
      color: "#5cc51c",
    },
    completed: {
      color: "#f64f4f",
    },
    padding: {
      color: "#ecaa00",
    },
    message: {
      textAlign: "center",
      fontSize: "1.2rem",
      color: "#145098",
    },
    btnBox: {
      display: "flex",
      justifyContent: "space-between",
    },
  };

  const [selectedMandateRule, setSelectedMandateRule] = useState(null);
  const [show, setShow] = useState(false);

  // fetch all Loans
  const dispatch = useDispatch();
  const { statementRules, status } = useSelector(
    (state) => state.statementRuleReducer
  );

  useEffect(() => {
    const getData = async () => {
      await dispatch(fetchStatementRules());
    };

    getData();
  }, [dispatch]);

  // search statementRule list
  const [mandateRuleList, setMandateRuleList] = useState(statementRules);

  useEffect(() => {
    setMandateRuleList(statementRules);
  }, [statementRules]);

  const handleDeleteMandateRule = async (rule) => {
    try {
    
      const apiUrl = import.meta.env.VITE_BASE_URL;
      // Handle form submission logic here
      await fetch(`${apiUrl}/api/statement-rule/${rule._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await dispatch(fetchStatementRules());
      toast.success("Statement Rule Deleted successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getTableOptions = (rule) => {
    const tableOptions = [
      {
        className: "text-primary",
        icon: <IoMdCheckmarkCircleOutline />,
        label: "Edit",
        isDisabled: false,
        func: () => {
          setSelectedMandateRule(rule);
          setShow(true);
        },
      },
      {
        className: "text-danger",
        icon: <FcCancel />,
        label: "Delete",
        isDisabled: false,
        func: async () => {
          await handleDeleteMandateRule(rule);
        },
      },
    ];

    return tableOptions;
  };

  const handleClose = () => {
    setShow(false);
    setSelectedMandateRule(null);
  };

  return (
    <>
      <div className="MainBox mandateRule__containerList">
        <div>
          <h3>All Statement Rules</h3>
        </div>
        <div>
          {/* data loader */}
          {status === "loading" && <PageLoader />}

          {/* Loans list  */}
          <div className="ListSec">
            <DashboardHeadline
              height="52px"
              mspacer="0 0 -3.6rem -1rem"
              bgcolor="#145098"
            ></DashboardHeadline>
            <div style={styles.table}>
              <Table borderless hover responsive="sm">
                <thead style={styles.head}>
                  <tr>
                    <th>S/N</th>
                    <th>Title</th>
                    <th>Maximum Tenure</th>
                    <th>Maximum Amount</th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {mandateRuleList &&
                    sortByCreatedAt(mandateRuleList)?.length === 0 && (
                      <NoResult name="Statement Rule" />
                    )}
                  
                  {mandateRuleList &&
                    mandateRuleList?.map((statementRule, index) => {
                      return (
                        <tr key={statementRule.id}>
                          <td>{index + 1}</td>
                          <td>{statementRule.ruleTitle}</td>
                          <td>{statementRule.maximumTenure}</td>

                          <td>{statementRule?.maximumAmount}</td>

                          <td>
                            <TableOptionsDropdown
                              items={getTableOptions(statementRule)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </Table>
            </div>
            <NextPreBtn />
          </div>
        </div>
      </div>

      {show && (
        <EditStatementRule
          handleClose={handleClose}
          show={show}
          selectedMandateRule={selectedMandateRule}
        />
      )}
    </>
  );
};

export default StatementRuleList;
