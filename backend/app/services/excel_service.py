from typing import List
from app.schemas.attendance_schema import AttendanceReport
import pandas as pd
from io import BytesIO


class ExcelService:

    def generate_report_attendance_filter(
        self,
        data: List[AttendanceReport]
    ) -> BytesIO:

        records = []

        for r in data:
            records.append({
                "Usuario": r.user_name,
                "Área": r.area_name,
                "Sede": r.place_name,
                "Fecha": r.work_date.strftime("%Y-%m-%d"),
                "Hora Entrada": r.entry_time.strftime("%H:%M:%S") if r.entry_time else "",
                "Hora Salida": r.exit_time.strftime("%H:%M:%S") if r.exit_time else "",
                "Horas Trabajadas": r.total_hours or 0,
            })

        df = pd.DataFrame(records)

        output = BytesIO()
        with pd.ExcelWriter(output, engine="openpyxl") as writer:
            df.to_excel(writer, index=False, sheet_name="Asistencias")

        output.seek(0)
        return output
