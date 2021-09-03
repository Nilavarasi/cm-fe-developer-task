import React from "react";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";
import hrData from "assets/data/HR";

const styles = {
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0",
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF",
    },
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);

export default function DepartmentTable() {
  const getDetailedData = (department) => {
    fetch(`https://randomuser.me/api/?seed=${department}&results=10`)
      .then((results) => results.json())
      .then((data) => {
        const detailedData = data.results.map((details) => {
          return [
            details.name.title,
            details.name.first,
            details.name.last,
            details.gender,
            details.email,
            details.dob.age,
            details.phone,
            details.location.city,
            details.location.state,
            details.location.postcode,
            details.location.country,
            details.nat,
            <img key={details.email} src={details.picture.medium} alt="..." />,
          ];
        });
        setFormatedDepartmentDetails(detailedData);
        setCurrentDepartment(data.info.seed);
      });
  };
  function handleChange(event) {
    setSelectedValue(event.target.value);
  }
  function getDepartment(department) {
    localStorage.setItem("currentDepartment", department);
    getDetailedData(department);
  }

  const classes = useStyles();

  const [
    formatedDepartmentDetails,
    setFormatedDepartmentDetails,
  ] = React.useState([]);

  const [selectedValue, setSelectedValue] = React.useState(
    localStorage.getItem("currentDepartment")
  );

  const [currentDepartment, setCurrentDepartment] = React.useState("");

  const departmentData = hrData["departments"].map((data) => {
    return [
      <Radio
        key={data["department"]}
        checked={selectedValue === data["department"]}
        value={data["department"]}
        onChange={handleChange}
        inputProps={{ "aria-label": data["department"] }}
        onClick={() => getDepartment(data["department"])}
      />,
      data["department"],
      data["location"],
      data["manager"]["name"]["first"],
      data["manager"]["name"]["last"],
    ];
  });

  React.useEffect(() => {
    getDetailedData(localStorage.getItem("currentDepartment"));
  }, []);

  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary">
            <h4 className={classes.cardTitleWhite}>Departments</h4>
            <p className={classes.cardCategoryWhite}>
              Here is a list of departments and its employees
            </p>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={[
                "",
                "Department",
                "Location",
                "First Name",
                "Last Name",
              ]}
              tableData={departmentData}
            />
          </CardBody>
        </Card>
      </GridItem>
      <GridItem xs={12} sm={12} md={12}>
        <Card plain>
          <CardHeader plain color="primary">
            <h4 className={classes.cardTitleWhite}>Department Details</h4>
            <p className={classes.cardCategoryWhite}>
              {currentDepartment !== "null"
                ? `Department: ${currentDepartment}`
                : "No Department Choosen"}
            </p>
          </CardHeader>
          <CardBody>
            {currentDepartment !== "null" && (
              <Table
                tableHeaderColor="primary"
                tableHead={[
                  "Title",
                  "First Name",
                  "Last Name",
                  "Gender",
                  "Email",
                  "Age",
                  "Phone",
                  "City",
                  "State",
                  "Postal Code",
                  "Country",
                  "NAT",
                  "Image",
                ]}
                tableData={formatedDepartmentDetails}
              />
            )}
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}
