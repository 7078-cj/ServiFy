import { useState, useEffect } from "react";
import {
  Modal,
  Drawer,
  Button,
  TextInput,
  Textarea,
  Group
} from "@mantine/core";

const API_URL = "http://127.0.0.1:8000/api/business/";
const Media_URL = "http://127.0.0.1:8000/media/"; // your backend base URL

export default function BusinessManager() {

  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [portfolioFiles, setPortfolioFiles] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const accessToken = JSON.parse(localStorage.getItem("authTokens"))?.access;

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {

    const res = await fetch(API_URL + "businesses/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();
    setBusinesses(data);
  };

  const openBusinessModal = (business = null) => {

    if (business) {
      setFormData(business);
    } else {
      setFormData({
        id: null,
        name: "",
        description: "",
        address: "",
        latitude: "",
        longitude: "",
      });
    }

    setModalOpen(true);
  };

  const submitBusiness = async () => {

    const url = formData.id
      ? API_URL + `businesses/${formData.id}/`
      : API_URL + "businesses/";

    const method = formData.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      fetchBusinesses();
      setModalOpen(false);
    }
  };

  const openDrawer = (business) => {
    setSelectedBusiness(business);
    setDrawerOpen(true);
  };

  const uploadPortfolio = async () => {

    if (!selectedBusiness || portfolioFiles.length === 0) return;

    const form = new FormData();

    form.append("business_id", selectedBusiness.id);

    portfolioFiles.forEach((file) => {
      form.append("photos", file);
    });

    const res = await fetch(API_URL + "portfolios/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });

    if (res.ok) {
      alert("Portfolio uploaded");
      setPortfolioFiles([]);
    }
  };

  return (
    <div>

      <Button onClick={() => openBusinessModal()}>
        Create Business
      </Button>

      <div style={{ marginTop: 20 }}>

        {businesses.map((b) => (

          <div key={b.id} style={{ marginBottom: 10 }}>

            <strong>{b.name}</strong>

            <Button size="xs" onClick={() => openBusinessModal(b)}>
              Edit
            </Button>

            <Button size="xs" onClick={() => openDrawer(b)}>
              View
            </Button>

          </div>

        ))}

      </div>

      {/* Business Modal */}

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={formData.id ? "Update Business" : "Create Business"}
      >

        <TextInput
          label="Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((p) => ({ ...p, name: e.target.value }))
          }
        />

        <Textarea
          label="Description"
          mt="sm"
          value={formData.description}
          onChange={(e) =>
            setFormData((p) => ({ ...p, description: e.target.value }))
          }
        />

        <TextInput
          label="Address"
          mt="sm"
          value={formData.address}
          onChange={(e) =>
            setFormData((p) => ({ ...p, address: e.target.value }))
          }
        />

        <TextInput
          label="Latitude"
          type="number"
          mt="sm"
          value={formData.latitude}
          onChange={(e) =>
            setFormData((p) => ({ ...p, latitude: e.target.value }))
          }
        />

        <TextInput
          label="Longitude"
          type="number"
          mt="sm"
          value={formData.longitude}
          onChange={(e) =>
            setFormData((p) => ({ ...p, longitude: e.target.value }))
          }
        />

        <Group mt="md" justify="flex-end">
          <Button onClick={submitBusiness}>
            Save
          </Button>
        </Group>

      </Modal>

      {/* Business Drawer */}

     

    <Drawer
    opened={drawerOpen}
    onClose={() => setDrawerOpen(false)}
    title={selectedBusiness?.name}
    padding="md"
    size="xl"
    >
    <p>{selectedBusiness?.description}</p>
    <p>Address: {selectedBusiness?.address}</p>

    {/* Portfolio Images */}
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: 20 }}>
        {selectedBusiness?.portfolio?.map((p) => (
        <img
            key={p.id}
            src={`${Media_URL}${p.photo}`} // concatenate backend URL + media path
            alt={`Portfolio ${p.id}`}
            style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 6 }}
        />
        ))}
    </div>

    {/* File input for uploading new portfolio images */}
    <div style={{ marginTop: 20 }}>
        <input
        type="file"
        multiple
        onChange={(e) => setPortfolioFiles(Array.from(e.target.files))}
        />
        <Button mt="sm" onClick={uploadPortfolio}>
        Upload Portfolio
        </Button>
    </div>
    </Drawer>

    </div>
  );
}