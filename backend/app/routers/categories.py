from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app import schemas
from app.auth import get_current_user
from app.database import get_categories_col
from app.models import serialize, to_object_id

router = APIRouter(prefix="/api/categories", tags=["Categories"])


@router.get("", response_model=List[schemas.CategoryOut])
async def get_categories(current_user: dict = Depends(get_current_user)):
    """Lấy tất cả categories."""
    col = get_categories_col()
    docs = await col.find({}).sort("name", 1).to_list(length=100)
    return [schemas.CategoryOut(**serialize(d)) for d in docs]


@router.post("", response_model=schemas.CategoryOut, status_code=status.HTTP_201_CREATED)
async def create_category(
    body: schemas.CategoryCreate,
    current_user: dict = Depends(get_current_user),
):
    """Tạo category mới."""
    col = get_categories_col()
    doc = body.model_dump()
    result = await col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return schemas.CategoryOut(**doc)


@router.put("/{category_id}", response_model=schemas.CategoryOut)
async def update_category(
    category_id: str,
    body: schemas.CategoryUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Cập nhật category."""
    try:
        oid = to_object_id(category_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Category ID không hợp lệ")

    updates = body.model_dump(exclude_unset=True)
    col = get_categories_col()
    doc = await col.find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=True
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Category không tìm thấy")
    return schemas.CategoryOut(**serialize(doc))


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(
    category_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Xóa category."""
    try:
        oid = to_object_id(category_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Category ID không hợp lệ")

    col = get_categories_col()
    result = await col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category không tìm thấy")
