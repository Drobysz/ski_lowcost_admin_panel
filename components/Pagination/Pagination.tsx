import { Icon } from "@/components/Icon";
import styles from "./style.module.scss";
import type { PaginationProps } from "./Pagination.props";

export function Pagination({
  label,
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className={styles.pagination}>
      <p>{label}</p>
      {totalPages > 1 ? (
        <div className={styles.buttons}>
          <button
            aria-label="Previous page"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <Icon name="chevron-left" />
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                className={page === currentPage ? styles.active : ""}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            );
          })}
          <button
            aria-label="Next page"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <Icon name="chevron-right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
