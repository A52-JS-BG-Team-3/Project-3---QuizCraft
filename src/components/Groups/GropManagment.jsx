import from "react";
import GroupForm from "./GroupForm";
import GroupList from "./GroupList";

const GroupManagement = () => {

  return (
    <div style={{
        marginTop: "10%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
      }}
    >
        
      <GroupForm actionType="create" />
      <GroupForm actionType="join" />
      <GroupList />
    </div>
  );
};

export default GroupManagement;
