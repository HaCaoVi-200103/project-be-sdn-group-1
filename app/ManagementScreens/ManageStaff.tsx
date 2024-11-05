import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";

import Button from "@components/ManagerStaffComponent/Button";
import { Colors } from "@constants/Colors";
import BoxStaff from "@components/ManagerStaffComponent/BoxStaff";
import useCreateAxios from "@hooks/axiosHook";
import { useFocusEffect, useNavigation } from "expo-router";
import Search from "@components/ManagerStaffComponent/Search";
import { Dropdown } from "@components/ManagerStaffComponent/Select";
import ModalCustomize from "@components/ManagerStaffComponent/Modal";
import HeaderCustomize from "@components/ManagerStaffComponent/HeaderCustomize";
const ManageStaff = () => {
  const { createRequest } = useCreateAxios();
  const [data, setData]: any = useState([]);
  const [valueS, setValueS] = useState("");
  const [allData, setAllData]: any = useState([]);
  const [filter, setFilter] = useState("");
  const [filterData, setFilterData]: any = useState([]);
  const [active, setActive] = useState(false);
  // const navigation = useNavigation();

  // React.useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerShown: false,
  //   });
  // }, [navigation]);

  const getData = async () => {
    try {
      const res = await createRequest("get", "/staff/list-staff");
      if (res.status === 200) {
        setAllData(res.data);
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const searchData = () => {
    if (filterData.length === 0) {
      const filteredData =
        valueS === ""
          ? allData
          : allData.filter((x: any) =>
              x.full_name.toLowerCase().startsWith(valueS.toLowerCase())
            );
      setData(filteredData);
    } else {
      const filteredData =
        valueS === ""
          ? filterData
          : filterData.filter((x: any) =>
              x.full_name.toLowerCase().startsWith(valueS.toLowerCase())
            );
      setData(filteredData);
    }
  };

  useEffect(() => {
    searchData();
  }, [valueS]);

  const selectFilterAZ = () => {
    const sortedData = [...data].sort((a: any, b: any) => {
      if (a.full_name < b.full_name) {
        return -1;
      }
      if (a.full_name > b.full_name) {
        return 1;
      }
      return 0;
    });
    setData(sortedData);
    setFilterData(sortedData);
  };

  const handleFiter = (v: string) => {
    setFilter(v);
  };

  const selectFilterZA = () => {
    const sortedData = [...data].sort((a: any, b: any) => {
      if (a.full_name > b.full_name) {
        return -1;
      }
      if (a.full_name < b.full_name) {
        return 1;
      }
      return 0;
    });
    setData(sortedData);
    setFilterData(sortedData);
  };

  useEffect(() => {
    if (filter === "A-Z") {
      selectFilterAZ();
    } else if (filter === "Z-A") {
      selectFilterZA();
    } else {
      setData(allData);
    }
  }, [filter]);

  return (
    <>
      <View style={styles.container}>
        {/* <HeaderCustomize title="Manager Staff" /> */}
        <View style={styles.boxButton}>
          <ModalCustomize
            refetch={getData}
            active={active}
            setActive={setActive}
          />
          <Button
            onPress={() => setActive(!active)}
            backgoundColor={Colors.BURGUNDYRED}
            colorIcon={Colors.IVORYWHITE}
            nameIcon="person-add"
          />
        </View>
        <View>
          <Search setValueS={setValueS} />
          <Dropdown setValueF={handleFiter} />
        </View>
        <View style={styles.boxList}>
          {data && data.length > 0 && (
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <BoxStaff
                  staffId={item._id}
                  name={item.full_name}
                  phone={item.phone_number}
                  email={item.email}
                  avatar={item.staff_avatar}
                />
              )}
              keyExtractor={(item) => item._id + ""}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default ManageStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  boxButton: {
    margin: 10,
    justifyContent: "flex-start",
    width: 120,
  },
  boxList: {
    flex: 1,
  },
});
