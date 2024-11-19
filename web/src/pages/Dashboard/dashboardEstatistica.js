import React from "react";
import styles from "./dashboardEstatistica.module.css";

const DashboardEstatistica = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dashboard}>
        <h1>Análise Estatística</h1>
        <iframe
          title="PI_Estatistica_SUNGUARD"
          width="600"
          height="373.5"
          src="https://app.powerbi.com/view?r=eyJrIjoiOTZlN2IyYzAtNjE2ZS00ZDdmLTkwZjAtZjgxMWEzODcyY2Q4IiwidCI6ImNmNzJlMmJkLTdhMmItNDc4My1iZGViLTM5ZDU3YjA3Zjc2ZiIsImMiOjR9&pageName=005a97a74c7e0be1cdb9"
          frameborder="0"
          allowFullScreen="true"
        ></iframe>
      </div>
    </div>
  );
};

export default DashboardEstatistica;
