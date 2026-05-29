from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app import schemas
from app.auth import get_current_user
from app.database import get_task_templates_col
from app.models import serialize, to_object_id

router = APIRouter(prefix="/api/task-templates", tags=["Task Templates"])


@router.get("", response_model=List[schemas.TaskTemplateOut])
async def get_templates(current_user: dict = Depends(get_current_user)):
    """Lấy tất cả task templates."""
    col = get_task_templates_col()
    docs = await col.find({}).to_list(length=100)
    return [schemas.TaskTemplateOut(**serialize(d)) for d in docs]


@router.post("", response_model=schemas.TaskTemplateOut, status_code=status.HTTP_201_CREATED)
async def create_template(
    body: schemas.TaskTemplateCreate,
    current_user: dict = Depends(get_current_user),
):
    """Tạo task template mới."""
    col = get_task_templates_col()
    doc = body.model_dump()
    result = await col.insert_one(doc)
    doc["id"] = str(result.inserted_id)
    return schemas.TaskTemplateOut(**doc)


@router.put("/{template_id}", response_model=schemas.TaskTemplateOut)
async def update_template(
    template_id: str,
    body: schemas.TaskTemplateUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Cập nhật task template."""
    try:
        oid = to_object_id(template_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Template ID không hợp lệ")

    updates = body.model_dump(exclude_unset=True)
    col = get_task_templates_col()
    doc = await col.find_one_and_update(
        {"_id": oid}, {"$set": updates}, return_document=True
    )
    if not doc:
        raise HTTPException(status_code=404, detail="Template không tìm thấy")
    return schemas.TaskTemplateOut(**serialize(doc))


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_template(
    template_id: str,
    current_user: dict = Depends(get_current_user),
):
    """Xóa task template."""
    try:
        oid = to_object_id(template_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Template ID không hợp lệ")

    col = get_task_templates_col()
    result = await col.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Template không tìm thấy")
